using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Mail;
using System.Net.Configuration;
using System.Configuration;
using System.Net;
using System.Web.SessionState;
using System.Threading.Tasks;
using System.Data;
using System.Reflection;
//using EASendMail;
namespace Leadership.Models
{
    public class CommonModel
    {
        private static LeadershipEntities db = new LeadershipEntities();
        public static string GetBaseUrl()
        {
            UrlHelper urlHelper = new UrlHelper(HttpContext.Current.Request.RequestContext);
            return urlHelper.Content("~/");
        }
        public static int GetRandomNumber()
        {
            Random rnd = new Random();
            int rnd_num = rnd.Next(10000, 99999);
            return rnd_num;
        }
        public static bool IsRole()
        {
            bool Ischeck = false;
            if (HttpContext.Current.User.IsInRole(Leadership.Models.UserRoles.Sadmin) || HttpContext.Current.User.IsInRole(Leadership.Models.UserRoles.Admin))
            {
                Ischeck = true;
            }
            return Ischeck;
        }
        public static string IsRoleLogin()
        {
            string str = string.Empty;
            if (HttpContext.Current.User.IsInRole(Leadership.Models.UserRoles.Admin))
            {
                str = "all";
            }
            else
            {
                str= HttpContext.Current.User.Identity.Name;    
            }
            return str;
        }
        public static bool IsRoleViewer()
        {
            bool Ischeck = false;
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                if (HttpContext.Current.User.IsInRole(Leadership.Models.UserRoles.Viewer))
                {
                    Ischeck = true;
                }
            }
            return Ischeck;
        }
        public static DateTime GetDate(string date)
        {
            return DateTime.ParseExact(date, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
        }
        public static string GetDateFormate(string date)
        {
            if (!string.IsNullOrWhiteSpace(date))
                return Convert.ToDateTime(date).ToString("dd-MMM-yyyy");
            return DateTime.Now.Date.ToString("dd-MMM-yyyy");

        }
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
       
        public static List<SelectListItem> BlankList()
        {
            List<SelectListItem> list = new List<SelectListItem>();
            list.Add(new SelectListItem { Text = "Select", Value = "", Selected = true });

            return list;
        }
      
        //public static EmployeeModel GetEmployee(int? id = 0)
        //{
        //    EmployeeModel model = new EmployeeModel();
        //    try
        //    {
        //        if (id > 0 && id != null)
        //        {
        //            var emp = db.m_EmployeeList?.FirstOrDefault(x => x.EmpId_pk == id);
        //            model.EmployeeName = emp.Name;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        string error = ex.Message;
        //    }
        //    return model;
        //}
        public static string GetRandomPassword()
        {
            string Password = "";
            try
            {
                string Capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                string Small = "abcdefghijklmnopqrstuvwxyz";
                string Digits = "1234567890";
                string Special = "!@#$%&";

                Random rndm = new Random();

                for (int i = 1; i <= 3; i++)
                {
                    Password = Password + Small[rndm.Next(0, Small.Length - 1)];
                    if (i <= 2 || rndm.Next(1, 10) > 5)
                    {
                        Password = Password + Capital[rndm.Next(0, Capital.Length - 1)];
                    }
                    if (i <= 2 || rndm.Next(1, 10) > 5)
                    {
                        Password = Password + Digits[rndm.Next(0, Digits.Length - 1)];
                    }
                    if (i == 1 || rndm.Next(1, 10) > 5)
                    {
                        Password = Password + Special[rndm.Next(0, Special.Length - 1)];
                    }
                }

            }
            catch (Exception ex)
            {
                string error = ex.Message;
                Password = "nfAD?dihbf#3265";
            }
            return Password;
        }
        //public static List<SelectListItem> GetHubListItems(int? id = 0, bool WithAll = false)
        //{

        //    List<SelectListItem> list = new List<SelectListItem>();
        //    try
        //    {
        //        if (HttpContext.Current.User.IsInRole("Sadmin"))
        //        {
        //            list = new SelectList(db.m_Hub.OrderBy(m => m.hubname).Select(s => new { Name = s.hubname, Id = s.hubid_pk }).ToList(), "Id", "Name", id).ToList();
        //            if (WithAll)
        //            {
        //                list.Insert(0, new SelectListItem { Text = "All", Value = "0" });
        //            }
        //        }
        //        else
        //        {
        //            //  list = new SelectList(db.m_Hub.Where(x => x.hubid_pk == SessionLog.Hubid).OrderBy(m => m.hubname).Select(s => new { Name = s.hubname, Id = s.hubid_pk }).ToList(), "Id", "Name", id).ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        string error = ex.Message;
        //    }
        //    return list;
        //}

      
        //public static List<SelectListItem> GetModeofJourneyList(string value = "")
        //{
        //    List<SelectListItem> list = new List<SelectListItem>();
        //    try
        //    {
        //        list = new SelectList(db.m_Mode_of_Journey.OrderBy(m => m.Mode_Of_Journey), "Mode_Of_Journey", "Mode_Of_Journey", value).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        string error = ex.Message;
        //    }
        //    return list;
        //}
        public static List<SelectListItem> GetRoleList()
        {
            List<SelectListItem> list = new List<SelectListItem>();
            ApplicationDbContext context = new ApplicationDbContext();
            try
            {
                if (HttpContext.Current.User.Identity.Name == "sourabh@careindia.org" || HttpContext.Current.User.Identity.Name == "rajuks@careindia.org")
                    list = new SelectList(context.Roles.ToList(), "Name", "Name").ToList();
                else
                    list = new SelectList(context.Roles.Where(x => x.Name != "Sadmin").ToList(), "Name", "Name").ToList();
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
            return list;
        }
        public static List<SelectListItem> GetRoleIDNameList()
        {
            List<SelectListItem> list = new List<SelectListItem>();
            ApplicationDbContext context = new ApplicationDbContext();
            try
            {
                if (HttpContext.Current.User.Identity.Name == "sourabh@careindia.org" || HttpContext.Current.User.Identity.Name == "rajuks@careindia.org")
                    list = new SelectList(context.Roles.ToList(), "Id", "Name").ToList();
                else
                    list = new SelectList(context.Roles.Where(x => x.Name != "Sadmin").ToList(), "Id", "Name").ToList();
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
            return list;
        }
        public static List<SelectListItem> GetSchoolList(int? id = 0)
        {
            List<SelectListItem> list = new List<SelectListItem>();
            var result = 0;// db.m_SchoolMaster.Where(m => m.StateCode_fk == 20);
            id = id == null ? 0 : id;
          //  list = new SelectList(result.Where(x => x.SchoolId_pk == id || (1 == 1 && id == 0)).Select(m => new { Text = m.SchoolName, Value = m.SchoolId_pk }).OrderBy(m => m.Text), "Value", "Text").ToList();
            list.Insert(0, new SelectListItem { Text = "Select School", Value = "" });
            return list;
        }
       
      
        public static List<SelectListItem> GetSchoolType()
        {
            List<SelectListItem> list = new List<SelectListItem>();
            try
            {
                list.Add(new SelectListItem() { Text = "KGBV", Value = "KGBV" });
                list.Add(new SelectListItem() { Text = "JBAV", Value = "JBAV" });
                list.Insert(0, new SelectListItem() { Text = "Select One", Value = "" });

            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
            return list;
        }
        //public static List<SelectListItem> GetClassList()
        //{
        //    List<SelectListItem> list = new List<SelectListItem>();
        //    try
        //    {
        //        list = db.ClassMasters.Where(x => x.IsActive == true).ToList().Select(b => new SelectListItem { Text = b.ClassName.ToString(), Value = b.Id.ToString(), Selected = true }).OrderBy(x => Convert.ToInt32(x.Value)).ToList();
        //        list.Add(new SelectListItem() { Text = "Select One", Value = "" });
        //    }
        //    catch (Exception ex)
        //    {
        //        string error = ex.Message;
        //    }
        //    return list;
        //}
        public static class SessionLog
        {
            //public static int EmployeeId { get { return MvcApplication.Emplog().EmpId_pk; } }
            //public static int SchoolId_fk { get { return MvcApplication.Emplog().SchoolId_fk == null ? 0 : MvcApplication.Emplog().SchoolId_fk.Value; } }
            //public static int DistrictId { get { return MvcApplication.Emplog().DistrictId_fk ?? 0; } }
            //public static int BlockId { get { return MvcApplication.Emplog().BlockId_fk ?? 0; } }
            ////public static int? EmployeeCode { get { return MvcApplication.Emplog().EmpCode; } }
            //public static string Name { get { return MvcApplication.Emplog().Name; } }
            //public static string Email { get { return MvcApplication.Emplog().Email; } }
            //public static string EmpGuid { get { return MvcApplication.Emplog().EmpGuid; } }
            ////  public static int Hubid { get { return MvcApplication.Emplog().Hubid_fk.Value; } }

            //// public static int? SupervisorId { get { return MvcApplication.Emplog().SupervisorId; } }
            //public static int? StateId { get { return MvcApplication.Emplog().StateId_fk; } }
            //  public static string SupervisorName { get { return MvcApplication.Emplog().SupervisorName; } }
            //public static string SupervisorEmail { get { return MvcApplication.Emplog().SupervisorEmail; } }
        }
        public class Parameter
        {

            public string AccountType { get; set; }
            public int AccountNo { get; set; }
            public string Value { get; set; }
            public string Status { get; set; }
            public string SearchType { get; set; }
            public string DateFrom { get; set; }
            public string DateTo { get; set; }

        }
        public static class ApproveDisapproveResult
        {
            public static string InvalidRequest { get { return "<span class='fa fa-check'>Invalid request !</span>"; } }
            public static string InvalidSupervisor { get { return "<span class='fa fa-check'>Invalid Supervisor !</span>"; } }
            public static string ApproveRequest { get { return "<span class='fa fa-check'>Approved</span>"; } }
            public static string ReviseRequest { get { return "<span class='fa fa-check'>Revise request send  !</span>"; } }
            public static string AlreadyApproveRequest { get { return "<span class='fa fa-check'>Approved !</span>"; } }
            public static string RejectRequest { get { return "<span class='fa fa-check'>Request have been  Rejected</span>"; } }
            public static string AlreadyRejectRequest { get { return "<span class='fa fa-check'>Already Rejected</span>"; } }
            public static string Exception { get { return "oops...Something went wrong."; } }
        }
    }
    public class DashboardModel
    {
        public DashboardModel()
        {
            TotalSchool = 0;
            TotaHRSubmission = 0;
            TotalChildSubmission = 0;
            TotalInfraSubmission = 0;


        }
        public int TotalSchool { get; set; }
        public int TotaHRSubmission { get; set; }
        public int TotalChildSubmission { get; set; }
        public int TotalInfraSubmission { get; set; }


    }
    public class Javascript
    {
        public static void ConsoleLog(string msg)
        {
            try
            {
                HttpContext.Current.Response.Write("<script>console.log(" + msg + ")</script>");
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }

        public static void ConsoleError(string msg)
        {
            try
            {
                HttpContext.Current.Response.Write("<script>console.error(" + msg + ")</script>");
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }
    }

    public class Mail
    {
        // constants
        private const string HtmlEmailHeader = "<html><head><meta http-equiv='imagetoolbar' content='no' /><title></title><link rel ='stylesheet' href ='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'><script type='text/javascript'>$(document).ready(function () {$('body').bind('cut copy paste', function (e) {e.preventDefault();}); $('body').on('contextmenu',function(e){return false;});});</script></head><body>";
        private const string HtmlEmailFooter = "</body></html>";

        // properties
        public List<string> To { get; set; }
        public List<string> CC { get; set; }
        public List<string> BCC { get; set; }
        // public string From { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        //public string Attachment { get; set; }
        public bool IsSendByMail { get; set; }

        // constructor
        public Mail()
        {
            To = new List<string>();
            CC = new List<string>();
            BCC = new List<string>();
            IsSendByMail = false;
        }

        // send
        public string Send()
        {
            string result = "";
            try
            {
                MailMessage message = new MailMessage();
                var smtpSection = (SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");
                foreach (var x in To)
                {
                    if (!string.IsNullOrEmpty(x))
                    {
                        message.To.Add(x);
                    }
                }
                foreach (var x in CC)
                {
                    if (!string.IsNullOrEmpty(x))
                    {
                        message.CC.Add(x);
                    }
                }
                foreach (var x in BCC)
                {
                    if (!string.IsNullOrEmpty(x))
                    {
                        message.Bcc.Add(x);
                    }
                }

                message.Subject = Subject;
                // message.Attachments.Add(Attachment)
                message.Body = string.Concat(HtmlEmailHeader, Body, HtmlEmailFooter);
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.SubjectEncoding = System.Text.Encoding.UTF8;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;
                message.From = new MailAddress(smtpSection.From, "CARE India - TAR");


                SmtpClient client = new SmtpClient();
                client.UseDefaultCredentials = false;
                client.Credentials = new System.Net.NetworkCredential(smtpSection.Network.UserName, smtpSection.Network.Password);
                client.Port = smtpSection.Network.Port;
                client.Host = smtpSection.Network.Host;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;


                Task.Run(() =>
                {
                    client.Send(message);
                    client.Dispose();
                    message.Dispose();

                });

                result = "mail send successfully";
            }
            catch (Exception ex)
            {
                Javascript.ConsoleError("Error in email function : " + ex.Message);
                Javascript.ConsoleError("Error in email function : " + ex);
            }

            return result;
        }

    }
    public enum YesNoEnum
    {
        Yes = 1,
        No = 0
    }
    public enum ApprovelStatusEnum
    {
        Pending = 1,
        Approved = 2,
        Revise = 3,
        Cancel = 4
    }
    public enum SendEmailOptionEnum
    {
        senior = 1,
        junior = 2,
        Entry = 3,
        IsReviseYes,
        IsReviseNo

    }
    public enum ActionTakenBy
    {
        Web,
        Email
    }
    public class UserRoles
    {
        public const string Accounts = "Accounts";
        public const string Admin = "Admin";
        public const string User = "User";
        public const string Sadmin = "Sadmin";
        public const string Warden = "Warden";
        public const string Viewer = "Viewer";
    }


}