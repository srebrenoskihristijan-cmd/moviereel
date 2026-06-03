// Model class mirroring the Genre collection.
export class Genre {
  constructor(d = {}) {
    this.id = d._id || d.id || "";
    this.name = d.name || "";
  }
  static fromApi(json) { return new Genre(json); }
}
