import React, { useState, useCallback } from 'react';
import { fetchIssues, GitHubIssue } from '../services/githubService';

export interface UseIssuesViewer {
  // State
  repoInput: string;
  patInput: string;
  owner: string;
  repo: string;
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  nextPageUrl: string | null;
  showResults: boolean;

  // Actions
  setRepoInput: (value: string) => void;
  setPatInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleLoadMore: () => void;
  handleBackClick: () => void;
}

export function useIssuesViewer(): UseIssuesViewer {
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
    },
    [repoInput, patInput, loadIssues],
  );

  const handleLoadMore = useCallback(() => {
    if (nextPageUrl && !loading) {
      loadIssues(owner, repo, patInput, nextPageUrl, true);
    }
  }, [nextPageUrl, loading, owner, repo, patInput, loadIssues]);

  const handleBackClick = useCallback(() => {
    setShowResults(false);
    setIssues([]);
    setError(null);
    setNextPageUrl(null);
  }, []);

  return {
    // State
    repoInput,
    patInput,
    owner,
    repo,
    issues,
    loading,
    error,
    nextPageUrl,
    showResults,

    // Actions
    setRepoInput,
    setPatInput,
    handleSubmit,
    handleLoadMore,
    handleBackClick,
  };
}

export default useIssuesViewer;
