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
    public partial class Schedule : ContentPage
    {
        public Schedule()
        {
            InitializeComponent();

            getSchedule(); // get latest schedule from back-end
        }

        public void getSchedule()
        {
            var httpRequest = new HttpRequest(); // create a new request object
            var scheduleData = httpRequest.GetAll("/schedule/"); // make GET request to back-end

            listViewSchedule.ItemsSource = scheduleData;
        }
    }
}