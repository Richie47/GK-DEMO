import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { fetchIssues, GitHubIssue } from '../services/githubService';
import './issuesviewer.css'; // Match your actual filename

// Component renamed to force clean remount and avoid HMR issues
function GitHubIssuesViewer(): React.ReactElement {
  const [repoInput, setRepoInput] = useState<string>('');
  const [patInput, setPatInput] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const loadIssues = useCallback(
    async (
      targetOwner: string,
      targetRepo: string,
      targetPat: string,
      pageUrl: string | null = null,
      append: boolean = false,
    ) => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetchIssues(
          targetOwner,
          targetRepo,
          targetPat,
          pageUrl,
        );
        if (append) {
          setIssues((prevIssues) => [...prevIssues, ...response.issues]);
        } else {
          setIssues(response.issues);
        }
        setNextPageUrl(response.nextPageUrl);
        setShowResults(true);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setIssues([]);
        setNextPageUrl(null);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parts = repoInput.split('/');
    if (parts.length === 2 && parts[0] && parts[1]) {
      setOwner(parts[0]);
      setRepo(parts[1]);
      loadIssues(parts[0], parts[1], patInput, null, false);
    } else {
      setError('Please enter a valid repository in the format "owner/repo"');
      setIssues([]);
      setNextPageUrl(null);
      setShowResults(false);
    }
  };

  const handleLoadMore = () => {
    if (nextPageUrl && !loading) {
      loadIssues(owner, repo, patInput, nextPageUrl, true);
    }
  };

  const handleRepoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepoInput(e.target.value);
  };

  const handlePatInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPatInput(e.target.value);
  };

  const handleBackClick = () => {
    setShowResults(false);
    setIssues([]);
    setError(null);
    setNextPageUrl(null);
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
        // Results View - Now with scrolling container
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

export default GitHubIssuesViewer;
