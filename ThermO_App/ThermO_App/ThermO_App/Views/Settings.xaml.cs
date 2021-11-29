using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThermO_App.Classes;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ThermO_App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Settings : ContentPage
    {
        private Dictionary<string, string> settings; // init empty dict.

        public Settings()
        {
            InitializeComponent();
            getSettings();
        }

        /// <summary>
        /// Retrieves current settings from back-end
        /// </summary>
        private async void getSettings()
        {
            var httpRequest = new HttpRequest(); // http request object

            try
            {
                // try to make HTTP call
                settings = httpRequest.GetSingle("/settings/");
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fout", "Er is een fout opgetreden: " + ex, "OK");
            }
        }
    }
}