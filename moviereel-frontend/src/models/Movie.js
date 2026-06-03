// Model class mirroring the Movie collection.
export class Movie {
  constructor(d = {}) {
    this.id = d._id || d.id || "";
    this.title = d.title || "";
    this.year = d.year ?? null;
    this.genre = d.genre ?? null; // populated {_id,name} or raw id
    this.director = d.director || "";
    this.runtime = d.runtime || 0;
    this.overview = d.overview || "";
    this.accent = d.accent || "#e0a93f";
    this.posterUrl = d.posterUrl || "";
    this.avgRating = d.avgRating || 0;
    this.tmdbId = d.tmdbId ?? null;
  }
  static fromApi(json) { return new Movie(json); }
  get genreName() { return this.genre && typeof this.genre === "object" ? this.genre.name : ""; }
  get genreId() { return this.genre && typeof this.genre === "object" ? this.genre._id : this.genre; }
}
