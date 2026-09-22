import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faFeatherPointed,
  faQuoteLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePortfolio } from "../../Context/PortfolioContext";
import { useAuth } from "../../Context/AuthContext";
import EditableText from "../../Components/Admin/EditableText";
import "./Books.css";

export default function Books() {
  const { data } = usePortfolio();
  const { isAdmin } = useAuth();

  if (!data) return null;

  const books = data.books || [];
  const seriesList = data.series || [];

  const handleAddBook = () => {
    books.push({
      title: "New Book Title",
      subtitle: "New Subtitle",
      status: "Forthcoming",
      publisher: "Publisher Name",
      year: "2027",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
      description: "Description of the book...",
      quote: "Notable review quote",
      quoteAuthor: "Reviewer",
      links: [{ label: "Buy Link", url: "https://example.com" }],
    });
    // Trigger re-render
    books.slice();
  };

  const handleAddSeries = () => {
    seriesList.push({
      title: "New Series Title",
      count: "4-Part Series",
      topic: "Topic Area",
      description: "Series summary...",
    });
    seriesList.slice();
  };

  return (
    <section id="books" className="books-section">
      <div className="books-container">
        <header className="books-header">
          <p className="books-label">Longform Projects</p>
          <h2 className="books-title">Books & Essays</h2>
          <p className="books-subtitle">
            Longer manuscripts, published books, and extended essay series
            investigating culture, memory, and narrative craft.
          </p>
        </header>

        {/* Books List */}
        <div className="books-list">
          {books.map((book, index) => (
            <article key={book._id || index} className="book-card">
              <div className="book-cover-wrapper">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={`Book cover for ${book.title}`}
                    className="book-cover-img"
                  />
                )}
                {book.status && (
                  <span
                    className={`book-status-badge ${
                      book.status === "Published"
                        ? "status-published"
                        : "status-forthcoming"
                    }`}
                  >
                    <EditableText
                      value={book.status}
                      onChange={(val) => (book.status = val)}
                    />
                  </span>
                )}
              </div>

              <div className="book-info">
                <div className="book-meta-top">
                  <span className="book-publisher">
                    <EditableText
                      value={book.publisher}
                      onChange={(val) => (book.publisher = val)}
                    />
                  </span>
                  <span className="meta-dot">&bull;</span>
                  <span className="book-year">
                    <EditableText
                      value={book.year}
                      onChange={(val) => (book.year = val)}
                    />
                  </span>
                </div>

                <h3 className="book-title">
                  <EditableText
                    value={book.title}
                    onChange={(val) => (book.title = val)}
                  />
                </h3>

                <p className="book-subtitle-text">
                  <EditableText
                    value={book.subtitle}
                    onChange={(val) => (book.subtitle = val)}
                  />
                </p>

                <p className="book-description">
                  <EditableText
                    value={book.description}
                    multiline
                    onChange={(val) => (book.description = val)}
                  />
                </p>

                {book.quote && (
                  <blockquote className="book-quote">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="quote-icon"
                    />
                    <div>
                      <p className="quote-text">
                        "
                        <EditableText
                          value={book.quote}
                          onChange={(val) => (book.quote = val)}
                        />
                        "
                      </p>
                      <cite className="quote-author">
                        &mdash;{" "}
                        <EditableText
                          value={book.quoteAuthor}
                          onChange={(val) => (book.quoteAuthor = val)}
                        />
                      </cite>
                    </div>
                  </blockquote>
                )}

                {book.links && book.links.length > 0 && (
                  <div className="book-actions">
                    {book.links.map((link, idx) => (
                      <div key={link._id || idx} className="book-btn">
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="btn-icon"
                        />
                        <EditableText
                          value={link.label}
                          onChange={(val) => (link.label = val)}
                        />
                        :{" "}
                        <EditableText
                          value={link.url}
                          onChange={(val) => (link.url = val)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {isAdmin && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={handleAddBook}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ marginRight: "0.5rem" }}
              />
              Add New Book
            </button>
          </div>
        )}

        {/* Essay Series */}
        {seriesList.length > 0 && (
          <div className="series-section">
            <h3 className="series-heading">
              <FontAwesomeIcon
                icon={faFeatherPointed}
                className="heading-icon"
              />
              Serialized Essays & Collections
            </h3>

            <div className="series-grid">
              {seriesList.map((series, index) => (
                <div key={series._id || index} className="series-card">
                  <div className="series-header">
                    <span className="series-topic">
                      <EditableText
                        value={series.topic}
                        onChange={(val) => (series.topic = val)}
                      />
                    </span>
                    <span className="series-count">
                      <EditableText
                        value={series.count}
                        onChange={(val) => (series.count = val)}
                      />
                    </span>
                  </div>
                  <h4 className="series-title">
                    <EditableText
                      value={series.title}
                      onChange={(val) => (series.title = val)}
                    />
                  </h4>
                  <p className="series-desc">
                    <EditableText
                      value={series.description}
                      multiline
                      onChange={(val) => (series.description = val)}
                    />
                  </p>
                </div>
              ))}
            </div>

            {isAdmin && (
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  onClick={handleAddSeries}
                  style={{
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Add New Series
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
