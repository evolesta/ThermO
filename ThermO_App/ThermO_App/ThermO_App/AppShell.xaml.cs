using System;
using System.Collections.Generic;
using ThermO_App.Views;
using Xamarin.Forms;

namespace ThermO_App
{
    public partial class AppShell : Xamarin.Forms.Shell
    {
        public AppShell()
        {
            InitializeComponent();

            Routing.RegisterRoute("login", typeof(LoginPage));
            Routing.RegisterRoute("thermostat", typeof(Thermostat));
            Routing.RegisterRoute("schedule", typeof(Schedule));
            Routing.RegisterRoute("settings", typeof(Settings));
        }

    }
}
