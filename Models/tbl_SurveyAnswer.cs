//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Leadership.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_SurveyAnswer
    {
        public int Id { get; set; }
        public Nullable<int> SId_fk { get; set; }
        public Nullable<int> QuestionId_fk { get; set; }
        public string QuestionCode { get; set; }
        public Nullable<int> QuestionOption_fk { get; set; }
        public string ResponseCode { get; set; }
        public string InputValue { get; set; }
        public string InputValue1 { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
    
        public virtual tbl_Survey tbl_Survey { get; set; }
    }
}
