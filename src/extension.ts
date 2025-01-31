import * as vscode from 'vscode';

class CommentFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument
    ): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        let startLine: number | null = null;
        let lastLine: number | null = null;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const trimmedText = line.text.trim();

            if (trimmedText.startsWith('#')) {
                if (startLine === null) {
                    startLine = i;
                }
                lastLine = i;
            } else if (startLine !== null && lastLine !== null) {
                if (lastLine > startLine) {
                    ranges.push(new vscode.FoldingRange(
                        startLine, 
                        lastLine,
                        vscode.FoldingRangeKind.Comment
                    ));
                }
                startLine = null;
                lastLine = null;
            }
        }

        if (startLine !== null && lastLine !== null && lastLine > startLine) {
            ranges.push(new vscode.FoldingRange(
                startLine, 
                lastLine,
                vscode.FoldingRangeKind.Comment
            ));
        }

        return ranges;
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Register the folding range provider for all supported languages
    const provider = new CommentFoldingRangeProvider();
    const languages = ['python', 'ruby', 'shellscript', 'yaml'];
    
    languages.forEach(language => {
        context.subscriptions.push(
            vscode.languages.registerFoldingRangeProvider(
                { language },
                provider
            )
        );
    });

    // Register the command
    const disposable = vscode.commands.registerCommand('fold-single-line-comments.fold', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // Get the ranges
        const ranges = provider.provideFoldingRanges(editor.document);

        // Fold all the ranges
        if (ranges.length > 0) {
            vscode.commands.executeCommand('editor.fold', {
                selectionLines: ranges.map(range => range.start)
            });
            vscode.window.showInformationMessage(`Folded ${ranges.length} comment blocks`);
        } else {
            vscode.window.showInformationMessage('No comment blocks found to fold');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}