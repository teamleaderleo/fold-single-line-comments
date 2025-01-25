import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register the folding range provider for all languages
    const provider = new CommentFoldingRangeProvider();
    const disposable = vscode.languages.registerFoldingRangeProvider({ scheme: 'file' }, provider);
    
    // Register the command
    const commandDisposable = vscode.commands.registerCommand('fold-single-line-comments.fold', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // Get folding ranges
        const ranges = provider.provideFoldingRanges(editor.document);
        
        // Fold all the ranges
        if (ranges && ranges.length > 0) {
            editor.selections = [new vscode.Selection(0, 0, 0, 0)]; // Reset selection
            vscode.commands.executeCommand('editor.fold', {
                selectionLines: ranges.map(range => range.start)
            });
        }
    });

    context.subscriptions.push(disposable, commandDisposable);
}

class CommentFoldingRangeProvider implements vscode.FoldingRangeProvider {
    private getLanguageCommentSymbol(languageId: string): string {
        // Common single-line comment symbols by language
        const commentSymbols: { [key: string]: string } = {
            'typescript': '//',
            'javascript': '//',
            'python': '#',
            'ruby': '#',
            'powershell': '#',
            'shellscript': '#',
            'rust': '//',
            'cpp': '//',
            'c': '//',
            'csharp': '//',
            'java': '//',
            'go': '//',
            'php': '//',
            'swift': '//',
        };

        return commentSymbols[languageId] || '//';
    }

    provideFoldingRanges(
        document: vscode.TextDocument
    ): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        let startLine: number | null = null;
        let commentSymbol = this.getLanguageCommentSymbol(document.languageId);

        for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
            const line = document.lineAt(lineNum);
            const trimmedText = line.text.trim();

            if (trimmedText.startsWith(commentSymbol)) {
                if (startLine === null) {
                    startLine = lineNum;
                }
            } else if (startLine !== null) {
                // Only create a folding range if we have at least 2 consecutive comment lines
                if (lineNum - startLine > 1) {
                    ranges.push(new vscode.FoldingRange(
                        startLine,
                        lineNum - 1,
                        vscode.FoldingRangeKind.Comment
                    ));
                }
                startLine = null;
            }
        }

        // Handle case where file ends with comments
        if (startLine !== null && document.lineCount - startLine > 1) {
            ranges.push(new vscode.FoldingRange(
                startLine,
                document.lineCount - 1,
                vscode.FoldingRangeKind.Comment
            ));
        }

        return ranges;
    }
}

export function deactivate() {}