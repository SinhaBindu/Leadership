using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using SubSonic.Schema;
namespace Leadership.Models
{
    public class SP_Model
    {
        //public static DataTable GetHRList(int? YearId, int? FrequencyId = 0, int? DistrictId = 0, int? SchoolId = 0, string SchoolType = "")
        //{
        //    StoredProcedure sp = new StoredProcedure("SP_GetHRList");
        //    sp.Command.AddParameter("@YearId", YearId, DbType.Int32);
        //    sp.Command.AddParameter("@FrequencyId", FrequencyId, DbType.Int32);
        //    sp.Command.AddParameter("@DistrictId", DistrictId, DbType.Int32);
        //    sp.Command.AddParameter("@SchoolType", SchoolType, DbType.String);
        //    sp.Command.AddParameter("@SchoolId", SchoolId, DbType.Int32);
        //    DataTable dt = sp.ExecuteDataSet().Tables[0];
        //    return dt;
        //}
        //public static DataTable GetAcademicList(int? YearId, string TOF = "Monthly", int? FID = 0, int? DistrictId = 0, int? SchoolId = 0, string SchoolType = "")
        //{
        //    StoredProcedure sp = new StoredProcedure("SP_GetAcademicList");
        //    sp.Command.AddParameter("@YearId", YearId, DbType.Int32);
        //    sp.Command.AddParameter("@TOF", TOF, DbType.String);
        //    sp.Command.AddParameter("@FID", FID, DbType.Int32);
        //    sp.Command.AddParameter("@DistrictId", DistrictId, DbType.Int32);
        //    sp.Command.AddParameter("@SchoolType", SchoolType, DbType.String);
        //    sp.Command.AddParameter("@SchoolId", SchoolId, DbType.Int32);
        //    DataSet ds = sp.ExecuteDataSet();
        //    DataTable dt = new DataTable();
        //    if (ds.Tables.Count > 0)
        //    {
        //        dt = ds.Tables[0];
        //    }
        //    return dt;
        //}
        
        public static DataSet GetSP_AnswerData(string User)
        {
            StoredProcedure sp = new StoredProcedure("SP_AnswerData");
            sp.Command.AddParameter("@User", User, DbType.String);
            DataSet ds = sp.ExecuteDataSet();
            return ds;
        }
        public static DataSet GetSPQuestionSummary(string User)
        {
            StoredProcedure sp = new StoredProcedure("SP_QuestionSummary");
            sp.Command.AddParameter("@User", User, DbType.String);
            DataSet ds = sp.ExecuteDataSet();
            return ds;
        }
        #region Start 7 may 2024  Competency Survey Controller 
        public static DataSet GetSPScoreMarkAnswer(string User)
        {
            StoredProcedure sp = new StoredProcedure("SP_ScoreMarkAnswer");
            sp.Command.AddParameter("@User", User, DbType.String);
            DataSet ds = sp.ExecuteDataSet();
            return ds;
        }
        public static DataSet GetQuestionSummaryMarks(string User)
        {
            StoredProcedure sp = new StoredProcedure("SP_QuestionSummaryMarks");
            sp.Command.AddParameter("@User", User, DbType.String);
            DataSet ds = sp.ExecuteDataSet();
            return ds;
        }
        public static DataSet GetSP_ScorersSummaryMarks(string User)
        {
            StoredProcedure sp = new StoredProcedure("SP_ScorersSummary");
            sp.Command.AddParameter("@User", User, DbType.String);
            DataSet ds = sp.ExecuteDataSet();
            return ds;
        }
        #endregion
    }
}