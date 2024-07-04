using Leadership.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using Microsoft.Ajax.Utilities;
using System.Collections;
using Newtonsoft.Json;
using Microsoft.SqlServer.Server;

namespace Leadership.Controllers
{
    [Authorize]
    public class SLLTAssessmentsController : Controller
    {
        // GET: SLLTAssessments
        LeadershipEntities db = new LeadershipEntities();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetIndex(string User = "all")
        {
            DataSet ds = new DataSet();
            DataTable tbllist = new DataTable();
            var html = "";
            try
            {
                User = CommonModel.IsRoleLogin();
                ds = SP_Model.GetSPScoreMarkAnswerSLLT(User);
                bool IsCheck = false;
                if (ds.Tables.Count > 0)
                {
                    tbllist = (ds.Tables[0]);
                    IsCheck = true;
                    var DList = JsonConvert.SerializeObject(tbllist);
                    //html = ConvertViewToString("_Index", tbllist);
                    var res = Json(new { IsSuccess = IsCheck, Data = DList }, JsonRequestBehavior.AllowGet);
                    res.MaxJsonLength = int.MaxValue;
                    return res;
                }
                else
                {
                    var res = Json(new { IsSuccess = IsCheck, Data = "Record Not Found !!" }, JsonRequestBehavior.AllowGet);
                    res.MaxJsonLength = int.MaxValue;
                    return res;
                }
            }
            catch (Exception ex)
            {
                string er = ex.Message;
                return Json(new { IsSuccess = false, Data = "" }, JsonRequestBehavior.AllowGet); throw;
            }
        }
        public ActionResult ScorerSummary(string User = "all")
        {
            DataSet ds = new DataSet();
            DataTable tbllist = new DataTable();
            try
            {
                User = CommonModel.IsRoleLogin();
                ds = SP_Model.GetSP_ScorersSummaryMarksSLLT(User);
                if (ds.Tables.Count > 0)
                {
                    tbllist = (ds.Tables[0]);
                }
                return View(tbllist);
            }
            catch (Exception ex)
            {
                return View("Error");
            }
        }
        public ActionResult Summary()
        {
            return View();
        }
        public ActionResult GetSummary(string User = "all")
        {
            DataSet ds = new DataSet();
            DataTable tbllist = new DataTable();
            var html = "";
            try
            {
                User = CommonModel.IsRoleLogin();
                ds = SP_Model.GetQuestionSummaryMarksSLLT(User);
                bool IsCheck = false;
                if (ds.Tables.Count > 0)
                {
                    tbllist = (ds.Tables[0]);
                    IsCheck = true;
                    var DList = JsonConvert.SerializeObject(tbllist);
                    //html = ConvertViewToString("_Index", tbllist);
                    var res = Json(new { IsSuccess = IsCheck, Data = DList }, JsonRequestBehavior.AllowGet);
                    res.MaxJsonLength = int.MaxValue;
                    return res;
                }
                else
                {
                    var res = Json(new { IsSuccess = IsCheck, Data = "Record Not Found !!" }, JsonRequestBehavior.AllowGet);
                    res.MaxJsonLength = int.MaxValue;
                    return res;
                }
            }
            catch (Exception ex)
            {
                string er = ex.Message;
                return Json(new { IsSuccess = false, Data = "" }, JsonRequestBehavior.AllowGet); throw;
            }
        }

        public ActionResult Add(int? Id)
        {
            var m = GetAdd(Id);
            return View(m);
        }
        private QesRes GetAdd(int? Id)

        {
            FormModel model;
            List<FormModel> modellist = new List<FormModel>();

            var tblhr = db.tbl_Survey.Find(Id);
            var tblhrAns = db.tbl_SurveyAnswer.Where(x => x.SId_fk == Id).ToList();
            var fid = Convert.ToInt32(3);
            var tbl = db.QuestionBooks.Where(x => x.IsActive == true && x.FormId_fk == fid && x.IsQuestionDisplay == true).OrderBy(x => x.QuestionCode).ToList();
            var tbloptionlist = db.QuestionOptions.Where(x => x.IsActive == true && x.FormId_fk == fid).ToList();
            if (tbl != null)
            {
                foreach (var item in tbl.ToList())
                {
                    model = new FormModel();
                    model.OptionList = new List<QuestOption>();
                    //model.OptionList.Clear();
                    model.FormId = item.FormId_fk.Value;
                    model.QuestionId_pk = item.Id;
                    model.QuestionCode = item.QuestionCode;
                    model.Question = item.Question;
                    model.ControlType = item.ControlType;
                    model.ParentQuestionCode = item.ParentQuestionCode;
                    model.DependedAnswer = item.DependedAnswer;
                    model.SectionType = item.SectionType;
                    model.HindiQuestion = item.HindiQuestion;
                    model.OptionTypeValidation = item.QuestTypeValidation;

                    var tbllist = tbloptionlist.Where(x => x.QuestionCode == item.QuestionCode).OrderBy(x => x.QuestionCode).ToList();
                    if (tbllist != null)
                    {
                        for (int i = 0; i < tbllist.Count; i++)
                        {
                            var ans = tblhrAns.FirstOrDefault(x => x.QuestionCode == tbllist[i].QuestionCode && x.QuestionOption_fk == tbllist[i].Id);
                            model.OptionList.Add(new QuestOption
                            {
                                Id = ans == null ? 0 : ans.Id,
                                FormId_fk = tbllist[i].FormId_fk,
                                OptionId_Pk = tbllist[i].Id,
                                QuestionId_fk = tbllist[i].QuestionId_fk.Value,
                                QuestionCode = tbllist[i].QuestionCode,
                                ControlInputType = tbllist[i].ControlInputType,
                                OptionTypeValidation = tbllist[i].OptionTypeValidation,
                                Limit = tbllist[i].Limit,
                                Text = tbllist[i].OptionText,
                                HindiOptionText = tbllist[i].HindiOptionText,
                                Value = tbllist[i].OptionCode,
                                InputText = ans?.InputValue,

                                LabelName1 = tbllist[i].LabelName1,
                                LabelName2 = tbllist[i].LabelName2,
                                ControlInputType1 = tbllist[i].ControlInputType1,
                                InputType1 = tbllist[i].InputType1,
                                InputText1 = ans?.InputValue1,

                                SelectedItem = ans != null
                            });
                            if (ans != null)
                            {
                                model.Answer = tbllist[i].OptionCode;
                            }
                        }
                    }
                    modellist.Add(model);
                }
            }
            var reslist = BuildQuestion(modellist);
            reslist = reslist.OrderBy(x => x.OrderBy).ToList();
            var qList = new List<FormModel>();
            foreach (var item in reslist.ToList())
            {
                qList.Add(item);
                if (item.ChildQuestionList != null && item.ChildQuestionList.Any())
                {
                    qList.AddRange(item.ChildQuestionList.ToList());
                }
            }
            if (tblhr != null)
            {
                if (tblhr.Id > 0)
                {
                    return new QesRes { Id = tblhr.Id, FormId = fid, YearId = tblhr.YearId, SchoolId = tblhr.SchoolId.Value, FrequencyId = tblhr.FrequencyId, Qlist = qList };
                }
            }
            ViewBag.Qlist = qList;
            return new QesRes { SchoolId = 0, FormId = fid, Qlist = qList };
        }

        [HttpPost]
        public ActionResult Add(QesRes model)
        {
            LeadershipEntities db_ = new LeadershipEntities();
            var result = 0; //var fid = Convert.ToInt32(2);
            try
            {
                //var resdata = this.Request.Unvalidated.Form.AllKeys;
                if (model != null)
                {
                    //if (model.SchoolId == 0)
                    //{
                    //    return Json(new { IsSuccess = false, res = "", msg = "Select School !" }, JsonRequestBehavior.AllowGet);
                    //}
                    var maintbl = model.Id != 0 ? db.tbl_Survey.Find(model.Id) : new tbl_Survey();
                    if (maintbl != null)
                    {
                        if (model.Id == 0)//&& !(db_.tbl_Survey.Any(x => x.SchoolId == model.Id))
                        {
                            if (db_.tbl_Survey.Any(x => x.CreatedBy == User.Identity.Name && x.FormId == model.FormId))
                            {
                                return Json(new { IsSuccess = false, res = "", msg = "This Record Is Already Exists !" }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                maintbl.FormId = Convert.ToInt32(model.FormId);
                                maintbl.YearId = model.YearId == null ? DateTime.Now.Year : Convert.ToInt32(model.YearId);
                                maintbl.FrequencyId = model.FrequencyId == null ? DateTime.Now.Month : Convert.ToInt32(model.FrequencyId);
                                maintbl.Date = DateTime.Now.Date;
                                maintbl.SchoolId = model.SchoolId;
                                maintbl.CreatedBy = User.Identity.Name;
                                maintbl.CreatedOn = DateTime.Now;
                                maintbl.IsActive = true;
                                db.tbl_Survey.Add(maintbl);
                            }
                        }
                        else
                        {
                            maintbl.UpdatedBy = User.Identity.Name;
                            maintbl.UpdatedOn = DateTime.Now;
                            maintbl.IsActive = true;
                        }
                        result += db.SaveChanges();
                        if (model.Qlist != null && maintbl.Id > 0)
                        {
                            var mid = maintbl.Id;
                            var tblHRAnsMain = db_.tbl_SurveyAnswer.Where(x => x.SId_fk == maintbl.Id).ToList();
                            foreach (var item in model.Qlist.ToList())
                            {
                                if (item.OptionList != null)
                                {
                                    var asnlist = tblHRAnsMain.Where(x => x.QuestionId_fk == item.QuestionId_pk && x.SId_fk == maintbl.Id).ToList();
                                    for (int i = 0; i < item.OptionList.Count; i++)
                                    {
                                        var isSaveChild = false;
                                        var Resid = item.OptionList[i].Id;
                                        var IsMainRes = false;
                                        if (Resid != 0 && mid != 0)
                                        {
                                            IsMainRes = true;
                                        }
                                        var Resptbl = IsMainRes == true ? tblHRAnsMain.Where(c => c.SId_fk == mid && c.Id == Resid)?.FirstOrDefault() : new tbl_SurveyAnswer();
                                        if (Resptbl != null)
                                        {
                                            Resptbl.Id = item.OptionList[i].Id;

                                            Resptbl.SId_fk = mid;
                                            Resptbl.QuestionId_fk = item.QuestionId_pk;
                                            Resptbl.QuestionCode = item.QuestionCode;
                                            Resptbl.QuestionOption_fk = item.OptionList[i].OptionId_Pk;

                                            if (item.OptionList[i].SelectedItem == true && item.ControlType.ToLower() == "checkbox")
                                            {
                                                Resptbl.ResponseCode = item.OptionList[i].Value;
                                                Resptbl.InputValue = item.OptionList[i].InputText;
                                                Resptbl.InputValue1 = item.OptionList[i].InputText1;
                                                isSaveChild = true;
                                            }
                                            if (!string.IsNullOrWhiteSpace(item.OptionList[i].AnswerValue) && item.OptionList[i].AnswerValue != "0" && item.ControlType.ToLower() == "radio")
                                            {
                                                Resptbl.ResponseCode = item.OptionList[i].AnswerValue;
                                                //Resptbl.InputValue = item.OptionList[i].AnswerValue;
                                                //Resptbl.InputValue1 = item.OptionList[i].AnswerValue;
                                                isSaveChild = true;
                                            }
                                            else if (!string.IsNullOrWhiteSpace(item.Answer) && item.ControlType.ToLower() == "radiobutton")
                                            {
                                                if (item.Answer == item.OptionList[i].Value)
                                                {
                                                    Resptbl.ResponseCode = item.Answer;
                                                    Resptbl.InputValue = item.OptionList[i].InputText;
                                                    isSaveChild = true;
                                                }
                                                else
                                                {
                                                    var ans = asnlist.FirstOrDefault(x => x.QuestionCode == item.QuestionCode && x.QuestionOption_fk == item.OptionList[i].OptionId_Pk);
                                                    if (ans != null)
                                                    {
                                                        db.tbl_SurveyAnswer.Remove(ans);
                                                    }
                                                }
                                            }
                                            else if (item.OptionList[i].SelectedItem != true && item.ControlType.ToLower() == "textbox")
                                            {
                                                if (!string.IsNullOrWhiteSpace(item.OptionList[i].InputText))
                                                {
                                                    Resptbl.ResponseCode = item.OptionList[i].Value;
                                                    Resptbl.InputValue = item.OptionList[i].InputText;
                                                    isSaveChild = true;
                                                }
                                                else
                                                {
                                                    var ans = asnlist.FirstOrDefault(x => x.QuestionCode == item.QuestionCode && x.QuestionOption_fk == item.OptionList[i].OptionId_Pk);
                                                    if (ans != null)
                                                    {
                                                        db.tbl_SurveyAnswer.Remove(ans);
                                                    }
                                                }
                                            }
                                            else if (item.OptionList[i].SelectedItem != true && item.ControlType.ToLower() == "textarea")
                                            {
                                                if (!string.IsNullOrWhiteSpace(item.OptionList[i].InputText))
                                                {
                                                    Resptbl.ResponseCode = item.OptionList[i].Value;
                                                    Resptbl.InputValue = item.OptionList[i].InputText;
                                                    isSaveChild = true;
                                                }
                                                else
                                                {
                                                    var ans = asnlist.FirstOrDefault(x => x.QuestionCode == item.QuestionCode && x.QuestionOption_fk == item.OptionList[i].OptionId_Pk);
                                                    if (ans != null)
                                                    {
                                                        db.tbl_SurveyAnswer.Remove(ans);
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                var ans = asnlist.FirstOrDefault(x => x.QuestionCode == item.QuestionCode && x.QuestionOption_fk == item.OptionList[i].OptionId_Pk);
                                                if (ans != null)
                                                {
                                                    db.tbl_SurveyAnswer.Remove(ans);
                                                }
                                            }

                                            if (Resptbl.Id == 0 && isSaveChild)
                                            {
                                                Resptbl.CreatedBy = User.Identity.Name;
                                                Resptbl.CreatedOn = DateTime.Now;
                                                Resptbl.IsActive = true;
                                                db.tbl_SurveyAnswer.Add(Resptbl);
                                                result += db.SaveChanges();
                                            }
                                            else
                                            {
                                                result += db_.SaveChanges();
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (result > 0)
                    {
                        //Success($"{action} successfully!", true);
                        // return RedirectToAction("Add", "Infra");
                        //Success("HR save and modified successfully !", true);
                        // return RedirectToAction("Index", "HR");
                        ModelState.Clear();
                        var res = GetAdd(maintbl.Id);
                        var html = ConvertViewToString("add", res);
                        var action = maintbl.Id == 0 ? "Saved" : "Modified";
                        var resResponse = Json(new { IsSuccess = true, htmlData = html, msg = action }, JsonRequestBehavior.AllowGet);
                        resResponse.MaxJsonLength = int.MaxValue;
                        return resResponse;
                        //Success("HR save and modified successfully !", true);
                        // return Json(new { IsSuccess = true, res = html, MSG = "HR save and modified successfully !" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { IsSuccess = false, htmlData = "Something went wrong.", msg = "Something went wrong." }, JsonRequestBehavior.AllowGet);

                //if (result > 0)
                //{
                //    Success("HR save and modified successfully !", true);
                //    return RedirectToAction("Add", "HR");
                //}
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                //Danger("Something went wrong..", true);
                return Json(new { IsSuccess = false, htmlData = "Something went wrong.", msg = "Something went wrong." }, JsonRequestBehavior.AllowGet);
            }
            // return View(model);
        }
        public ActionResult GetViewData(int? Id)
        {
            var html = "";
            try
            {
                var tblhr = db.tbl_Survey.Find(Id);
                bool IsCheck = false;
                if (tblhr != null && tblhr.Id > 0)
                {
                    FormModel model;
                    List<FormModel> modellist = new List<FormModel>();

                    var tblhrAns = db.tbl_SurveyAnswer.Where(x => x.SId_fk == Id).ToList();
                    var fid = Convert.ToInt32(1);
                    var tbl = db.QuestionBooks.Where(x => x.IsActive == true && x.FormId_fk == fid).OrderBy(x => x.QuestionCode).ToList();
                    if (tbl != null)
                    {
                        foreach (var item in tbl.ToList())
                        {
                            model = new FormModel();
                            model.OptionList = new List<QuestOption>();
                            //model.OptionList.Clear();
                            model.QuestionId_pk = item.Id;
                            model.QuestionCode = item.QuestionCode;
                            model.Question = item.Question;
                            model.HindiQuestion = item.HindiQuestion;
                            model.ControlType = item.ControlType;
                            model.ParentQuestionCode = item.ParentQuestionCode;
                            model.DependedAnswer = item.DependedAnswer;
                            model.SectionType = item.SectionType;
                            var tbllist = db.QuestionOptions.Where(x => x.QuestionCode == item.QuestionCode).OrderBy(x => x.QuestionCode).ToList();
                            if (tbllist != null)
                            {
                                for (int i = 0; i < tbllist.Count; i++)
                                {
                                    if (tblhrAns != null)
                                    {
                                        var ans = tblhrAns.FirstOrDefault(x => x.QuestionCode == tbllist[i].QuestionCode && x.QuestionOption_fk == tbllist[i].Id);
                                        if (ans != null && ans.Id > 0)
                                        {
                                            model.OptionList.Add(new QuestOption
                                            {
                                                Id = ans == null ? 0 : ans.Id,
                                                OptionId_Pk = tbllist[i].Id,
                                                QuestionId_fk = tbllist[i].QuestionId_fk.Value,
                                                QuestionCode = tbllist[i].QuestionCode,
                                                ControlInputType = tbllist[i].ControlInputType,
                                                OptionTypeValidation = tbllist[i].OptionTypeValidation,
                                                Limit = tbllist[i].Limit,
                                                Text = tbllist[i].OptionText,
                                                HindiOptionText = tbllist[i].HindiOptionText,
                                                Value = tbllist[i].OptionCode,
                                                InputText = ans?.InputValue,
                                                InputText1 = ans?.InputValue1,

                                                LabelName1 = tbllist[i].LabelName1,
                                                LabelName2 = tbllist[i].LabelName2,
                                                SelectedItem = ans != null
                                            });
                                            if (ans != null)
                                            {
                                                model.Answer = tbllist[i].OptionCode;
                                            }
                                        }
                                    }
                                }
                            }
                            modellist.Add(model);
                        }
                    }
                    var reslist = BuildQuestion(modellist);
                    if (tblhr != null)
                    {
                        if (tblhr.Id > 0)
                        {
                            var m1 = new QesRes { Id = tblhr.Id, FrequencyId = tblhr.FrequencyId, YearId = tblhr.YearId, Qlist = reslist };
                            // var m = new QesRes { Qlist = reslist };
                            IsCheck = true;
                            html = ConvertViewToString("_ViewData", m1);
                            var res = Json(new { IsSuccess = IsCheck, Data = html }, JsonRequestBehavior.AllowGet);
                            res.MaxJsonLength = int.MaxValue;
                            return res;
                        }
                    }
                    var res1 = Json(new { IsSuccess = IsCheck, Data = "Record Not Found !!" }, JsonRequestBehavior.AllowGet);
                    res1.MaxJsonLength = int.MaxValue;
                    return res1;
                }
                else
                {
                    var res = Json(new { IsSuccess = IsCheck, Data = "Record Not Found !!" }, JsonRequestBehavior.AllowGet);
                    res.MaxJsonLength = int.MaxValue;
                    return res;
                }
            }
            catch (Exception ex)
            {
                string er = ex.Message;
                return Json(new { IsSuccess = false, Data = "" }, JsonRequestBehavior.AllowGet); throw;
            }
        }

        #region Recursion
        public static List<FormModel> BuildQuestion(List<FormModel> source)
        {
            var groups = source.GroupBy(i => i.ParentQuestionCode);

            var roots = groups.FirstOrDefault(g => string.IsNullOrWhiteSpace(g.Key)).ToList();

            if (roots.Count > 0)
            {
                var dict = groups.Where(g => !string.IsNullOrWhiteSpace(g.Key)).ToDictionary(g => g.Key, g => g.ToList());
                for (int i = 0; i < roots.Count; i++)
                    AddChild(roots[i], dict);
            }

            return roots;
        }

        private static void AddChild(FormModel node, Dictionary<string, List<FormModel>> source)
        {
            if (source.ContainsKey(node.QuestionCode))
            {
                node.ChildQuestionList = source[node.QuestionCode];
                for (int i = 0; i < node.ChildQuestionList.Count; i++)
                    AddChild(node.ChildQuestionList[i], source);
            }
            else
            {
                node.ChildQuestionList = new List<FormModel>();
            }
        }
        private string ConvertViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (StringWriter writer = new StringWriter())
            {
                ViewEngineResult vResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                ViewContext vContext = new ViewContext(this.ControllerContext, vResult.View, ViewData, new TempDataDictionary(), writer);
                vResult.View.Render(vContext, writer);
                return writer.ToString();
            }
        }
        #endregion
        public ActionResult ReportGraph()
        {
            var model = new QesRes
            {

            };
            return View(model);
        }
        [HttpPost]
        public ActionResult ReportGraph(QesRes model)
        {
            bool isSuccess = false;
            try
            {
                DataTable dt = SP_Model.Sp_ReportGraph();
                if (dt.Rows.Count > 0)
                {
                    isSuccess = true;
                    var dataList = dt.AsEnumerable().Select(row => new
                    {
                        Question = row["Question"].ToString(),
                        SectionType = Convert.ToInt32(row["SectionType"]),
                        Response1 = row["1"].ToString(),
                        Response2 = row["2"].ToString(),
                        Response3 = row["3"].ToString(),
                        Response4 = row["4"].ToString(),
                        Response5 = row["5"].ToString(),
                    }).ToList();

                    return Json(new
                    {
                        IsSuccess = isSuccess,
                        Data = dataList
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    IsSuccess = isSuccess,
                    Data = "No records found."
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    IsSuccess = isSuccess,
                    Data = "There was a communication error."
                }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}