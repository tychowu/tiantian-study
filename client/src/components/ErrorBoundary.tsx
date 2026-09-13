import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * 捕獲渲染階段的例外，避免整站白屏。
 * 錯誤畫面沿用「天天的奇想書桌」語彙：米白紙張底色、深海軍藍文字、天天橙行動色。
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FFF8E8] p-6">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-4xl" aria-hidden="true">
              🚀
            </div>
            <h1 className="mb-2 text-xl font-bold text-[#1B2A4A]">哎呀，紙飛機偏離軌道了</h1>
            <p className="mb-6 text-sm text-black/60">
              頁面遇到一點小狀況，重新整理一下就能繼續學習囉。
            </p>
            {this.state.error?.message ? (
              <p className="mb-6 rounded-lg bg-black/5 p-3 text-left text-xs text-black/50">
                {this.state.error.message}
              </p>
            ) : null}
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-full bg-[#FF6B3D] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
            >
              重新開始
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
