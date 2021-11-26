using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace ThermO_App.Models
{
    class Settings
    {
        /// <summary>
        /// Global variables to modify your application or back-end needs
        /// </summary>
         
        // URL for the back-end API (don't add slashes at the end)
        private string _BackendURL = "http://192.168.178.62:8000";
        
        // Access token lifetime in minutes 
        private int _AccessTokenLifetime = 30; 

        // Refresh token lifetime in minutes
        private int _RefreshTokenLifeTime = 10080; // 60 min * 24 hours * 7 days

        // NO EDIT BELOW HERE
        public string getBackendURL { get => _BackendURL; }
        public int AccessTokenLifetime { get => _AccessTokenLifetime; }
        public int RefreshTokenLifeTime { get => _RefreshTokenLifeTime; }
    }
}
