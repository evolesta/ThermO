using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using ThermO_App.Classes;

namespace ThermO_App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LoginPage : ContentPage
    { 

        public LoginPage()
        {
            InitializeComponent();

            loginWithPincode();
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void checkIfTokenIsValid()
        {
            // check if token exists 
            var httpRequest = new HttpRequest();
            if (httpRequest.isTokenStillValid())
            {
                // skip to main secured app
                await Shell.Current.GoToAsync("//thermostat");
            }
            else
            {
                // obtain a new set of tokens
                var username = Application.Current.Properties["username"].ToString();
                var password = Application.Current.Properties["password"].ToString();
                performLogin(username, password);
            }
        }

        private async void loginWithPincode()
        {
            // try to login user with pincode if it has been set to properties
            if (Application.Current.Properties.ContainsKey("pincode"))
            {
                int counter = 0; // counter for max. 3 retries
                
                while (counter < 3)
                {
                    var pin = await DisplayPromptAsync("Voer pincode in", "Voer je persoonlijke pincode in:", maxLength: 4, keyboard: Keyboard.Numeric);

                    // validate for empty string
                    if (string.IsNullOrEmpty(pin))
                    {
                        counter++; // increase attempt
                        await DisplayAlert("Pincode leeg", "Het ingevoerde veld is leeg. Probeer opnieuw! Poging " + counter.ToString(), "OK");
                        continue; // go to next try
                    }

                    // validate for correct pin in properties
                    if (pin != Application.Current.Properties["pincode"].ToString())
                    {
                        counter++; // increase attempt
                        await DisplayAlert("Pincode onjuist", "De ingevoerde pincode is onjuist. Probeer opnieuw! Poging " + counter.ToString(), "OK");
                        continue; // go to next try
                    }

                    // pincode is correct, let's check tokens
                    checkIfTokenIsValid();
                    break; // escape from loop
                }

                // navigate user to secured area if counter hasn't passed 3 attempts
                if (counter < 3)
                {
                    await Shell.Current.GoToAsync("//thermostat");
                    return;
                }

                // let user login again with credentials
                await DisplayAlert("Pincode fout", "Maximum aantal pogingen bereikt. Probeer in te loggen.", "OK");
            }
        }

        /// <summary>
        /// Setups the personal pincode for the first time after a succesfull login
        /// </summary>
        private async void activatePincode(string username, string password)
        {
            // set action in true, so if validation fails the user has to repeat the steps again
            while (true)
            {
                var pin1 = await DisplayPromptAsync("Voer pincode in", "Voer een nieuwe gewenste pincode in:", maxLength: 4, keyboard: Keyboard.Numeric);

                // validate for empty string
                if (string.IsNullOrEmpty(pin1))
                {
                    await DisplayAlert("Geen pincode ingevoerd", "Het ingevoerde veld is leeg. Probeer het opnieuw.", "OK");
                    continue; // go to next try (iteration)
                }

                var pin2 = await DisplayPromptAsync("Herhaal pincode", "Herhaal de ingevoerde pincode:", maxLength: 4, keyboard: Keyboard.Numeric);

                // validate for empty string
                if (string.IsNullOrEmpty(pin2))
                {
                    await DisplayAlert("Geen pincode ingevoerd", "Het ingevoerde veld is leeg. Probeer het opnieuw.", "OK");
                    continue; // go to next try (iteration)
                }

                // validate if the two entered pins are equal
                if (pin1 != pin2)
                {
                    await DisplayAlert("Pincodes komen niet overeen", "De twee ingevoerde pincodes komen niet overeen. Probeer opnieuw.", "OK");
                    continue;
                }

                // validation has passed - setup pincode in properties
                Application.Current.Properties.Add("pincode", pin1);
                Application.Current.Properties.Add("username", username);
                Application.Current.Properties.Add("password", password);
                await Application.Current.SavePropertiesAsync(); // save

                break; // break out of loop
            }

            await Shell.Current.GoToAsync("//thermostat"); // redirect user to secured pages
        }

        /// <summary>
        /// Performs the login action at the API to achieve a new set of tokens
        /// </summary>
        /// <param name="username">The username of the user</param>
        /// <param name="password">The password of the user</param>
        public bool performLogin(string username, string password)
        {
            // make a http request to api
            try
            {
                var httpRequest = new HttpRequest();
                httpRequest.obtainToken(username, password);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Achieve a set of tokens by submitting the username and password
        /// </summary>
        private async void Button_Clicked(object sender, EventArgs e)
        {
            // get text from entries
            var username = gebruikersnaam.Text;
            var password = wachtwoord.Text;

            // check if entries are filled with data
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                await DisplayAlert("Fout", "Niet alle velden zijn ingevuld. Probeer het opnieuw.", "OK");
                return;
            }

            // make HTTP request to API
            if (!performLogin(username, password))
            {
                await DisplayAlert("Foutmelding", "Er is iets foutgegaan bij het aanmelden!", "OK");
                return;
            }

            activatePincode(username, password); // let user set personal pincode
        }
    }
}