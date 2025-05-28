export interface IContact {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt?: Date;
  response_content?: string; // Nội dung phản hồi
  responder_email?: string; // Tên người phản hồi
  response_date?: string; // Ngày phản hồi
}
