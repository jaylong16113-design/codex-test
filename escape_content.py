#!/usr/bin/env python3
"""Convert a text content file to properly escaped JSON content string."""
import json
import sys

# Read the article content from a text file
# This script reads from stdin or a file and outputs JSON-ready content

def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            text = f.read()
    else:
        text = sys.stdin.read()
    
    # The content is the raw markdown text
    # json.dumps will properly escape it
    print(json.dumps(text))

if __name__ == '__main__':
    main()
