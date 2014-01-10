using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Xml;

namespace QuickAddressWCF
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    public class QuickAddressService : IQuickAddressSErvice
    {
        public string GetData()
        {
            string serviceURL = @"http://tel.search.ch/api/?q=isolutions%20ag%20bern&key=40a64f101b6e6406c562814a37bdb84a";
            string dwml = string.Empty;

            System.Net.WebClient webClient = new System.Net.WebClient();
            dwml = webClient.DownloadString(serviceURL);            

            return dwml;
        }        
    }
}
