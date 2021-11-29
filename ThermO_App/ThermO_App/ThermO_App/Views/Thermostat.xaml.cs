﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using ThermO_App.Classes;

namespace ThermO_App.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Thermostat : ContentPage
    {
        // init double values
        private double currentTemp;
        private double desiredTemp;

        public Thermostat()
        {
            InitializeComponent();

            getCurrentTemperature(); // get the current temperature from back-end
        }

        /// <summary>
        /// gets the current temperature from the back-end and set GUI labels
        /// </summary>
        private void getCurrentTemperature()
        {
            var httpRequest = new HttpRequest();
            var response = httpRequest.GetSingle("/heatpoint/"); // make the GET request to the back-end
            var cultureInfo = new CultureInfo("en-US");

            currentTemp = double.Parse(response["temperature"], cultureInfo); // sets the current temperature
            currentTempLabel.Text = currentTemp.ToString() + " °C"; // sets the text on the label

            desiredTemp = double.Parse(response["heatpoint"], cultureInfo); // sets the desired temperature
            desiredTempLabel.Text = desiredTemp.ToString() + " °C"; // sets the text on the label
            desiredTempStepper.Value = desiredTemp; // sets value to stepper so the user can iteract with the temperature
        }

        private void desiredTempStepper_ValueChanged(object sender, ValueChangedEventArgs e)
        {
            desiredTemp = desiredTempStepper.Value; // get value from stepper
            desiredTempLabel.Text = desiredTemp.ToString(); // set label text with new value
        }

        /// <summary>
        /// Sends the new desired temperature to the back-end
        /// </summary>
      
        // TODO: fix double issue with round values displaying 20.0 instead of 20 
        private async void Button_Clicked(object sender, EventArgs e)
        {
            var httpRequest = new HttpRequest(); // new http object

            // generate dictionary for body paramters
            Dictionary<string, string> bodyParams = new Dictionary<string, string>();
            string desiredTempString = desiredTemp.ToString().Replace(",", ".");
            string currentTempString = currentTemp.ToString().Replace(",", ".");
            desiredTempString = string.Format("{0:0.00}", desiredTempString);
            currentTempString = string.Format("{0:0.00}", currentTempString);
            bodyParams.Add("temperature", currentTempString);
            bodyParams.Add("heatpoint", desiredTempString);

            httpRequest.Put("/heatpoint/1/", bodyParams); // make PUT request to the back-end

            await DisplayAlert("Succes", "Temperatuur is succesvol gewijzigd.", "OK");
        }
    }
}