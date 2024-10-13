enum PERMISSIONS {
  ADMIN_WORKFORCE = "ADMIN_WORKFORCE",
  // HR.
  HR_WORKFORCE_MEMBER = "HR_WORKFORCE_MEMBER",
  HR_WORKFORCE_INVITE = "HR_WORKFORCE_INVITE",
  // CRM.
  CRM_CONTACT_CUSTOMER = "CRM_CONTACT_CUSTOMER",
  CRM_CONTACT_SUPPLIER = "CRM_CONTACT_SUPPLIER",
  CRM_FEEDBACK = "CRM_FEEDBACK",
  CRM_FEEDBACK_MEDIA = "CRM_FEEDBACK_MEDIA",
  CRM_FEEDBACK_COMMENT = "CRM_FEEDBACK_COMMENT",
  CRM_FEEDBACK_SUBTASK = "CRM_FEEDBACK_SUBTASK",
  // Operations
  OP_JOB = "OP_JOB",
  OP_DISPATCH = "OP_DISPATCH",
  OP_CALENDAR = "OP_CALENDAR",
  OP_ORDER = "OP_ORDER",
  // Communication.
  COM_TASK = "COM_TASK",
  COM_TASK_MEDIA = "COM_TASK_MEDIA",
  COM_TASK_COMMENT = "COM_TASK_COMMENT",
  COM_TASK_SUBTASK = "COM_TASK_SUBTASK",
  // Database
  DB_SKILL = "DB_SKILL",
  DB_TAG = "DB_TAG",
  DB_BRAND = "DB_BRAND",
  DB_MANUAL = "DB_MANUAL",
  DB_SUPPLIER = "DB_SUPPLIER",
  DB_SUPPLIER_LOCATION = "DB_SUPPLIER_LOCATION",
  DB_SUPPLIER_CONTACT = "DB_SUPPLIER_CONTACT",
  DB_SUPPLIER_BRANDTAG = "DB_SUPPLIER_BRANDTAG",
  // Accounting.
  ACCTG_INVOICE = "ACCTG_INVOICE",
  ACCTG_ESTIMATE = "ACCTG_ESTIMATE",
  // Marketing.
  MKTG_REVIEW = "MKTG_REVIEW",
  // System.
  SYS_ACCESS = "SYS_ACCESS",
  SYS_TEMPLATE = "SYS_TEMPLATE",
  SYS_PAYMENT = "SYS_PAYMENT",
  SYS_CONFIG = "SYS_CONFIG"
}

export default PERMISSIONS;