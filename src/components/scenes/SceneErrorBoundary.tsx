"use client";

import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode; onError: () => void; }
interface State { failed: boolean; }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State { return { failed: true }; }

  componentDidCatch() { this.props.onError(); }

  render() { return this.state.failed ? null : this.props.children; }
}
