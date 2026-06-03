// Model class mirroring the User collection.
export class User {
  constructor(d = {}) {
    this.id = d.id || d._id || "";
    this.username = d.username || "";
    this.email = d.email || "";
    this.role = d.role || "user";
  }
  static fromApi(json) { return new User(json); }
  get isAdmin() { return this.role === "admin"; }
}
