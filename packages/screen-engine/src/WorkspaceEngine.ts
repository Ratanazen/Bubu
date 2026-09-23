import { WorkspaceInfo } from '@bubu/shared-types';

export class WorkspaceEngine {
  private workspaces: Map<string, WorkspaceInfo> = new Map();
  private activeWorkspaceId: string = '';
  private listeners: Set<(workspaces: WorkspaceInfo[], activeId: string) => void> = new Set();

  public updateWorkspaces(workspaces: WorkspaceInfo[]): void {
    this.workspaces.clear();
    for (const w of workspaces) {
      const idStr = w.id.toString();
      this.workspaces.set(idStr, w);
      if (w.isActive) {
        this.activeWorkspaceId = idStr;
      }
    }
    this.notify();
  }

  public getWorkspaces(): WorkspaceInfo[] {
    return Array.from(this.workspaces.values());
  }

  public getActiveWorkspace(): WorkspaceInfo | undefined {
    return this.workspaces.get(this.activeWorkspaceId);
  }

  public subscribe(listener: (workspaces: WorkspaceInfo[], activeId: string) => void): () => void {
    this.listeners.add(listener);
    listener(this.getWorkspaces(), this.activeWorkspaceId);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const list = this.getWorkspaces();
    this.listeners.forEach(fn => fn(list, this.activeWorkspaceId));
  }
}
