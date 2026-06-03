// Model class mirroring the Review collection.
export class Review {
  constructor(d = {}) {
    this.id = d._id || d.id || "";
    this.movie = d.movie ?? null;
    this.user = d.user ?? null; // populated {_id,username} or raw id
    this.rating = d.rating || 0;
    this.text = d.text || "";
    this.createdAt = d.createdAt || null;
  }
  static fromApi(json) { return new Review(json); }
  get username() { return this.user && typeof this.user === "object" ? this.user.username : "user"; }
  get userId() { return this.user && typeof this.user === "object" ? this.user._id : this.user; }
}
