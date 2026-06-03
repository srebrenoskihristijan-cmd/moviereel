import { Movie } from "./Movie.js";
// Model class mirroring the Watchlist collection.
export class Watchlist {
  constructor(d = {}) {
    this.id = d._id || d.id || "";
    this.movie = d.movie ? Movie.fromApi(d.movie) : null;
  }
  static fromApi(json) { return new Watchlist(json); }
}
