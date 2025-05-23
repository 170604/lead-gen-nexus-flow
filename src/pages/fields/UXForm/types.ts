
export interface FormValues {
  heading: string;
  subheading: string;
  auditCategory: string;
  materialCode: string;
  hsnCode: string;
  height: string;
  uom: string;
  quantity: string;
  price: string;
  totalAmount: string;
}

export interface UXFormSubmission extends FormValues {
  id: string;
  formType: string;
  leadId: string;
  submittedBy: string;
  submittedAt: Date;
}
