import React, { ChangeEvent } from 'react';
import { useIssuesViewer } from './useIssuesViewer';
import './IssuesViewer.css';

function IssuesViewer(): React.ReactElement {
  const {
    repoInput,
    patInput,
    owner,
    repo,
    issues,
    loading,
    error,
    nextPageUrl,
    showResults,
    setRepoInput,
    setPatInput,
    handleSubmit,
    handleLoadMore,
    handleBackClick,
  } = useIssuesViewer();

  const handleRepoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepoInput(e.target.value);
  };

  const handlePatInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPatInput(e.target.value);
  };

  return (
    <div className="app-container">
      {!showResults ? (
        // Search Form View
        <div className="search-view">
          <h1>GitHub Issues Viewer</h1>
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-group">
              <label htmlFor="repo">
                GitHub Repository (owner/repo):
                <input
                  id="repo"
                  type="text"
                  value={repoInput}
                  onChange={handleRepoInputChange}
                  placeholder="e.g., facebook/react"
                  required
                  className="input-field"
                />
              </label>
            </div>
            <div className="input-group">
              <label htmlFor="pat">
                Personal Access Token (optional):
                <input
                  id="pat"
                  type="password"
                  value={patInput}
                  onChange={handlePatInputChange}
                  placeholder="For private repos or higher rate limits"
                  className="input-field"
                />
              </label>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Loading...' : 'Load Issues'}
            </button>
          </form>
          {error && <p className="error-message">Error: {error}</p>}
        </div>
      ) : (
        // Results View
        <div className="results-container">
          {/* Fixed Header */}
          <div className="results-header">
            <button
              type="button"
              onClick={handleBackClick}
              className="back-button"
            >
              ← Back to Search
            </button>
            <h2>
              Open Issues for {owner}/{repo}
            </h2>
            {error && <p className="error-message">Error: {error}</p>}
          </div>

          {/* Scrollable Content Area */}
          <div className="scrollable-content">
            {issues.length === 0 && !loading && (
              <p className="no-issues-message">
                No open issues found for this repository.
              </p>
            )}

            <div className="issue-list">
              {issues.map((issue) => (
                <div key={issue.id} className="issue-item">
                  <h3>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{issue.number} {issue.title}
                    </a>
                  </h3>
                  <p>
                    Opened by{' '}
                    <a
                      href={issue.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {issue.user.login}
                    </a>{' '}
                    on {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="labels-container">
                      {issue.labels.map((label: any) => (
                        <span
                          key={label.name}
                          className="label"
                          style={{ backgroundColor: `#${label.color}` }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {loading && (
              <div className="loading-indicator">
                <p>Loading issues...</p>
              </div>
            )}
          </div>

          {/* Fixed Footer with Pagination */}
          <div className="results-footer">
            {issues.length > 0 && (
              <div className="issues-count">
                Showing {issues.length} issue{issues.length !== 1 ? 's' : ''}
                {nextPageUrl && ' (more available)'}
              </div>
            )}

            {nextPageUrl && (
              <div className="load-more-container">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="load-more-button"
                >
                  {loading ? 'Loading More...' : 'Load More Issues'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IssuesViewer;
