using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Leadership.Models
{
    public class FormModel
    {
        public FormModel()
        {
            QuestionId_pk = 0;
            // var q =CommonModel.GetQuestionsHR();
        }
        public int QuestionId_pk { get; set; }
        public int FormId { get; set; }
        public string TypeLanguage { get; set; }
        public string QuestionCode { get; set; }
        public string Question { get; set; }
        public string HindiQuestion { get; set; }
        public string QuestionType { get; set; }
        public string SectionType { get; set; }
        public string ControlType { get; set; }
        public string ControlInputType { get; set; }
        public string OptionTypeValidation { get; set; }
        public string QuestTypeValidation { get; set; }
        public string QuestionInputType { get; set; }
        public string ParentQuestionCode { get; set; }
        public string DependedAnswer { get; set; }
        public string YearId { get; set; }
        public string FrequencyId { get; set; }
        public string ReportingBy { get; set; }
        public string Limit { get; set; }
        public List<FormModel> ChildQuestionList { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
        public string Answer { get; set; }
        public string Frequency { get; set; }
        public int OrderBy { get; set; }
        public bool IsRepeat { get; set; }
        public List<QuestOption> OptionList { get; set; }

    }
    public class QuestOption
    {
        public QuestOption()
        {
            Id = 0;
            AnswerValue = "0";
        }
        public int Id { get; set; }
        public int OptionId_Pk { get; set; }
        public string TypeLanguage { get; set; }
        public Nullable<int> QuestionId_fk { get; set; }
        public Nullable<int> FormId_fk { get; set; }
        public string QuestionCode { get; set; }
        public string OptionTypeValidation { get; set; }
        public string OptionInputType { get; set; }
        public string OptionText { get; set; }
        public string OptionCode { get; set; }
        public string ControlInputType { get; set; }
        public string Limit { get; set; }
        public string Text { get; set; }
        public string HindiOptionText { get; set; }
        public string Value { get; set; }
        public bool SelectedItem { get; set; }
        public string AnswerValue { get; set; }
        public string InputText { get; set; }
        public string LabelName1 { get; set; }
        public string LabelName2 { get; set; }
        public string ControlInputType1 { get; set; }
        public string InputType1 { get; set; }
        public string InputText1 { get; set; }
    }
    public class QesRes
    {
        private int? _id;
        public int Id
        {
            get { return _id == null ? 0 : _id.Value; }
            set { _id = value; }
        }
        public DateTime? Date { get; set; }
        public int? YearId { get; set; }
        public int? FrequencyId { get; set; }
        public int? MonthId { get; set; }
        public int FormId { get; set; }
        public List<FormModel> Qlist { get; set; }
        public int Para { get; set; }
        public int SchoolType { get; set; }
        public int SchoolId { get; set; }
        public int DistrictId { get; set; }
        public int BlockId { get; set; }
        public string DISECODE { get; set; }
        public int EmpId { get; set; }
        public bool IsDraft { get; set; }
        public int? CommonFrequencyId { get; set; }
        public string TypeofFrequency { get; set; }

        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }


    }
    public class HRLable
    {
        public const string F01lbl = "How many teachers are there in school?";
        public const string F02lbl = "How many teachers are there for each of these subjects?";
        public const string F03lbl = "How many part time teachers are there in the school?";
        public const string F04lbl = "How many cooks are there in school?";
        public const string F05lbl = "How many guards are there in school?";
        public const string F06lbl = "How many cleaning staff are there?";
        public const string F07lbl = "Has an accountant being appointed in the school?";
        public const string F08lbl = "Is there any vacancy in school?";
        public const string F09lbl = "What vacancies are in the  school?";
        public const string F10lbl = "No of vacancies in the school";
    }

}