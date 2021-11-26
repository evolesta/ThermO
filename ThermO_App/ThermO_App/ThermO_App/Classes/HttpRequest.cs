using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using Newtonsoft.Json;
using RestSharp;
using ThermO_App.Models;

namespace ThermO_App.Classes
{
    class HttpRequest
    {
        private Settings settings = new Settings();

        /// <summary>
        /// Checks if the current access token is still valid to use. It also checks if the refresh token is still valid. If so, the access token will be renewed by the API.
        /// If not, the user has to login again to obtain a new set of access and refresh tokens.
        /// </summary>
        /// <returns>True if the access token is still valid, or is succesfully renewed using the refresh token. False is the user has to login again.</returns>
        public bool isTokenStillValid()
        {
            if (Application.Current.Properties.ContainsKey("accessToken"))
            {
                // token has been set, check if still valid
                var retrievedDateTime = DateTime.Parse(Application.Current.Properties["tokenReceived"].ToString()); // conv value from properties to DateTime
                var currentDateTime = DateTime.Now; // get current datetime
                var difference = currentDateTime.Subtract(retrievedDateTime); // calculate difference between current date and token receive date

                // check if the difference is lower then 30 minutes
                if (difference.TotalMinutes < settings.AccessTokenLifetime)
                {
                    return true; // token is still valid
                }
                // check if refresh token is still valid
                else if (difference.TotalMinutes < settings.RefreshTokenLifeTime)
                {
                    // obtain a new access token using refresh
                    if (refreshToken())
                        return true;
                    else
                        return false;
                }
                else
                {
                    // user has to login again
                    Application.Current.Properties.Remove("accessToken");
                    Application.Current.Properties.Remove("refreshToken");
                    Application.Current.Properties.Remove("tokenReceived");
                    Application.Current.SavePropertiesAsync();
                    return false;
                }
            }
            else
                return false;
        }

        /// <summary>
        /// Obtains a new access token using the refresh token. This void can only be used if the refresh token is still valid.
        /// </summary>
        public bool refreshToken()
        {
            var refreshToken = Application.Current.Properties["refreshToken"];
            var client = new RestClient(settings.getBackendURL + "/api/token/refresh/");
            var request = new RestRequest(Method.POST);
            request.AddParameter("refresh", refreshToken); // add refresh token to body

            var response = client.Post(request); // make POST request

            if (response.IsSuccessful)
            {
                // deseriale response and save tokens to properties
                var jsonData = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);
                Application.Current.Properties.Remove("accessToken");
                Application.Current.Properties.Remove("refreshToken");
                Application.Current.Properties.Remove("tokenReceived");
                Application.Current.Properties.Add("accessToken", jsonData["access"]);
                Application.Current.Properties.Add("refreshToken", jsonData["refresh"]);
                Application.Current.Properties.Add("tokenReceived", DateTime.Now);
                Application.Current.SavePropertiesAsync();

                return true;
            }
            else
            {
                Application.Current.Properties.Remove("accessToken");
                Application.Current.Properties.Remove("refreshToken");
                Application.Current.Properties.Remove("tokenReceived");
                Application.Current.SavePropertiesAsync();
                return false;
            }
        }

        /// <summary>
        /// This method obtains a new set of access and a refresh token, by providing the username and password of the user.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        public void obtainToken(string username, string password)
        {
            var client = new RestClient(settings.getBackendURL + "/api/token/");
            var request = new RestRequest(Method.POST);
            request.AddParameter("username", username);
            request.AddParameter("password", password);

            var response = client.Post(request); // make POST request

            if (Convert.ToInt32(response.StatusCode) != 200)
            { 
                throw new Exception("Request has failed: " + response.Content);
            }

            var jsonData = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);

            Application.Current.Properties.Add("accessToken", jsonData["access"]);
            Application.Current.Properties.Add("refreshToken", jsonData["refresh"]);
            Application.Current.Properties.Add("tokenReceived", DateTime.Now);
            Application.Current.SavePropertiesAsync();
        }

        /// <summary>
        /// Executes GET requests and returns the deserialized response content for multiple rows
        /// </summary>
        /// <param name="endpoint">Endpoint URL path for the request (ex. http://api.local/endpoint/)</param>
        /// <returns></returns>
        public List<Dictionary<string, string>> GetAll(string endpoint)
        {
            var client = new RestClient(settings.getBackendURL + endpoint);
            var request = new RestRequest(Method.GET);

            // add authorization & settings headers
            request.AddHeader("Authorization", "Bearer " + Application.Current.Properties["accessToken"]);
            request.AddHeader("Cache-control", "no-cache");
            request.AddHeader("Content-Type", "application/json");

            var response = client.Get(request);

            // only return data is response is succesful
            if (response.IsSuccessful)
                return JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(response.Content);
            else
                throw new Exception("Request has failed: " + response.Content);
        }

        /// <summary>
        /// Executes GET requests and returns the deserialized response content for a single row
        /// </summary>
        /// <param name="endpoint">Endpoint URL for the request</param>
        /// <returns></returns>
        public Dictionary<string, string> GetSingle(string endpoint)
        {
            var client = new RestClient(settings.getBackendURL + endpoint);
            var request = new RestRequest(Method.GET);

            // add authorization & settings headers
            request.AddHeader("Authorization", "Bearer " + Application.Current.Properties["accessToken"]);
            request.AddHeader("Cache-control", "no-cache");
            request.AddHeader("Content-Type", "application/json");

            var response = client.Get(request); // make GET request

            if (response.IsSuccessful)
                return JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);
            else
                throw new Exception("Request has failed: " + response.Content);
        }

        public Dictionary<string, string> Put(string endpoint,
            Dictionary<string, string> bodyParams = null)
        {
            var client = new RestClient(settings.getBackendURL + endpoint);
            var request = new RestRequest(Method.PUT);

            // add authorization & settings headers
            request.AddHeader("Authorization", "Bearer " + Application.Current.Properties["accessToken"]);
            request.AddHeader("Cache-control", "no-cache");
            request.AddHeader("Content-Type", "application/json");

            // check if there are any body paramters set, if so, iterate and add each parameter to the request
            if (bodyParams.Count > 0)
            {
                foreach (var param in bodyParams)
                {
                    request.AddParameter(param.Key, param.Value);
                }
            }

            var response = client.Put(request); // make PUT request

            if (response.IsSuccessful)
                return JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);
            else
                throw new Exception("Request has failed: " + response.Content);
        }
    }
}
