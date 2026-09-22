import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faClock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePortfolio } from "../../Context/PortfolioContext";
import { useAuth } from "../../Context/AuthContext";
import EditableText from "../../Components/Admin/EditableText";
import "./SelectedWorks.css";

export default function SelectedWorks() {
  const { data } = usePortfolio();
  const { isAdmin } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");

  if (!data) return null;

  const works = data.works || [];

  const dynamicCategories = [
    "All",
    ...Array.from(new Set(works.map((work) => work.category).filter(Boolean))),
  ];

  const filteredWorks =
    activeCategory === "All"
      ? works
      : works.filter((work) => work.category === activeCategory);

  const handleAddWork = () => {
    works.push({
      title: "New Article Title",
      category: activeCategory === "All" ? "Essays" : activeCategory,
      publication: "New Publication",
      date: "Month Year",
      readTime: "5 min read",
      excerpt: "Short article summary...",
      link: "https://example.com",
      featured: false,
    });
    // Force re-render
    setActiveCategory(activeCategory);
  };

  return (
    <section id="works" className="works-section">
      <div className="works-container">
        <header className="works-header">
          <p className="works-label">Archive & Publications</p>
          <h2 className="works-title">Selected Works</h2>
          <p className="works-subtitle">
            A curated selection of essays, cultural criticism, longform pieces,
            and short stories published across literary journals and magazines.
          </p>
        </header>

        {/* Category Filter Tabs */}
        <div className="filter-tabs">
          {dynamicCategories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Works List Grid */}
        <div className="works-grid">
          {filteredWorks.map((work, index) => (
            <article key={work._id || index} className="work-card">
              <div className="card-top">
                <span className="work-publication">
                  <EditableText
                    value={work.publication}
                    onChange={(val) => (work.publication = val)}
                  />
                </span>
                <span className="work-category-badge">
                  <EditableText
                    value={work.category}
                    onChange={(val) => (work.category = val)}
                  />
                </span>
              </div>

              <h3 className="work-card-title">
                <EditableText
                  value={work.title}
                  onChange={(val) => (work.title = val)}
                />
              </h3>

              <p className="work-excerpt">
                <EditableText
                  value={work.excerpt}
                  multiline
                  onChange={(val) => (work.excerpt = val)}
                />
              </p>

              <div className="card-footer">
                <div className="work-meta">
                  <span className="work-date">
                    <EditableText
                      value={work.date}
                      onChange={(val) => (work.date = val)}
                    />
                  </span>
                  <span className="meta-dot">&bull;</span>
                  <span className="work-time">
                    <FontAwesomeIcon icon={faClock} className="meta-icon" />
                    <EditableText
                      value={work.readTime}
                      onChange={(val) => (work.readTime = val)}
                    />
                  </span>
                </div>

                <div className="read-link">
                  URL:{" "}
                  <EditableText
                    value={work.link}
                    onChange={(val) => (work.link = val)}
                  />
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="link-icon"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Admin Add New Article Button */}
        {isAdmin && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={handleAddWork}
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
              Add New Article
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
