export default interface User {
  id: string;
  name: string;
  surname: string;
  // unique nickname
  nickname: string;
  projects: {
    id: string;
    title: string;
    role: "pending" | "basic" | "admin" | "super admin" | "owner";
  }[];
  teams: {
    id: string;
    title: string;
    role: "pending" | "basic" | "admin" | "owner";
  }[];
}
