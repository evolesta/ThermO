using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace ThermO_App.Models
{
    class Settings
    {
        private string BackendURL = "http://192.168.178.62:8000";
        public string getBackendURL { get => BackendURL; }

        public string getToken()
        {
            var token = Application.Current.Properties["accessToken"] as string;
            return token;
        }
    }
}
