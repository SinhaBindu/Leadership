using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Leadership.Models
{
    public static class Enums
    {
        public enum EnumFormName
        {
            HR = 1,
            CHILDENTITLEMENT = 2,
            Infra = 3,
            SupportManagement = 4,
            Academic = 5,
            Safety = 6
        }
        public enum EnumRatingGB
        {
            Poor = 1,
            Excellent = 5,
        }
        public enum EnumFrequency
        {
            Monthly = 1,
            Yearly = 2
        }
        public enum ESchoolType
        {
            KGBV = 1,
            JBAV = 2
        }
        public enum ETypeFrequency
        {
            Monthly = 1,
            Quarterly = 2,
            HalfYearly = 3,
            Yearly = 4
        }
    }
}