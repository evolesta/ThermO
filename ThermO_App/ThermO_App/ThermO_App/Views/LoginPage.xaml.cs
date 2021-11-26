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

            checkIfTokenIsValid(); // call async void if tokens are still valid within properties
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
                // try to login user with pincode if it has been set to properties
                if (Application.Current.Properties.ContainsKey("pincode"))
                {
                    // max 3 retries
                    for (int i = 0; i < 3; i++)
                    {
                        var pin = await DisplayPromptAsync("Voer pincode in", "Voer je persoonlijke pincode in:", maxLength: 4, keyboard: Keyboard.Numeric);

                        // validate for empty string
                        if (string.IsNullOrEmpty(pin))
                        {
                            await DisplayAlert("Pincode leeg", "Het ingevoerde veld is leeg. Probeer opnieuw! Poging " + i.ToString(), "OK");
                            continue; // go to next try
                        }

                        // validate for correct pin in properties
                        if (pin != Application.Current.Properties["pincode"].ToString())
                        {
                            await DisplayAlert("Pincode onjuist", "De ingevoerde pincode is onjuist. Probeer opnieuw! Poging " + i.ToString(), "OK");
                            continue; // go to next try
                        }

                        // pincode is correct
                        var username = Application.Current.Properties["username"].ToString();
                        var password = Application.Current.Properties["password"].ToString();

                        if (performLogin(username, password))
                            await Shell.Current.GoToAsync("//thermostat"); 
                    }
                }
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
            await Shell.Current.GoToAsync("//thermostat"); // redirect user to secured pages
        }
    }
}