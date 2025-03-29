import { ApplyStatus } from "./StatusEnum";

export interface Internship {
  internshipId: number;
  position: string;
  description: string;
  requirement: string;
  benefits: string;
  salary: number;
  companyLogo: string;
  companyName: string;
  companyLocation: string;
  companyAddress: string;
  majorName: string;
  companyID: number;
  majorId: number;
}

export interface Company {
  companyId: number;
  companyName: string;
  phoneNumber: string;
  websiteUrl: string;
  address: string;
  location: string;
  avatar: File | string;
  accountId: number;
}


export interface Major {
  majorId: number;
  majorName: string;
}

export interface Account {
  accountId: number;
  fullname: string;
  role: string;
  email: string;
  status: string;
}

export interface AccountEntity {
  accountId: number;
  fullname: string;
  role: string;
  email: string;
  status: number;
  age: number;
  gender: number;
  password: string;
  data: object | null;
}

export interface Student {
  StudentCode: string
  Major: string;
  Address: string;
  applyStatus: string | null;
  CvImage: string;
}

export interface StudentApplied {
  studentId: number;
  studentCode: string;
  major: string;
  address: string;
  cvImage: string;
  accountId: number;
  applyId: number;
  timeApply: string; // Date dạng string ISO
  applyStatus: string;
  internshipPosition: string;
}

export interface Proposal {
  proposalID: number;
  jobPosition: string;
  taskDescription: string;
  companyName: string;
  address: string;
  location: string;
  companyLogo: string;
  employeeSize: number;
  taxNumber: number;
  websiteURL: string;
  hrMail: string;
  hrName: string;
  studentID: number;
  status: string;
  evidences: string;
}

export interface Apply {
  studentName: string;
  timeApply: string;
  applyId: number;
  status: string;
  internshipPosition: string;
  companyName: string;
  internshipID: number;
}
