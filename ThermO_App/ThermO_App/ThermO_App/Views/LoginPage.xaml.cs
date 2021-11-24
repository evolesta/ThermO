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
        }

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

            // make a http request to api
            try
            {
                var httpRequest = new HttpRequest();
                httpRequest.obtainToken(username, password);
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fout", "Er is een fout opgetreden: " + ex, "OK");
                return;
            }

            await Shell.Current.GoToAsync("//thermostat");
        }
    }
}