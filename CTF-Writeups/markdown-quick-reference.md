# Markdown Quick Reference Template

Quick copy-paste templates for common markdown elements used in writeups.

---

## Images

### Basic Image
```markdown
![Image Description](path/to/image.png)
*Caption: What this image shows*
```

### Image with Relative Path
```markdown
![Screenshot](./image1.png)
*Caption: Description of the screenshot*
```

### Image with Absolute URL
```markdown
![Screenshot](https://example.com/image.png)
*Caption: Description*
```

---

## Code Blocks

### Bash/Shell Commands
```markdown
```bash
# Command description
command --flag value
ls -la
cat file.txt
```
```

### Python
```markdown
```python
# Python code
def example():
    return "code"
    
print("Hello World")
```
```

### JavaScript
```markdown
```javascript
// JavaScript code
function example() {
    return "code";
}
```
```

### SQL
```markdown
```sql
-- SQL query
SELECT * FROM table WHERE condition;
```
```

### HTML
```markdown
```html
<!-- HTML code -->
<div class="example">
    <p>Content</p>
</div>
```
```

### CSS
```markdown
```css
/* CSS code */
.example {
    color: red;
}
```
```

### JSON
```markdown
```json
{
    "key": "value",
    "number": 123
}
```
```

### Plain Text/Output
```markdown
```
Plain text output or flag
THM{flag_here}
```
```

---

## Links

### Basic Link
```markdown
[Link Text](https://example.com)
```

### Link with Description
```markdown
[Tool Name](https://example.com) - Description of what this tool does
```

### Link in a List
```markdown
- [Script Name](https://github.com/user/repo/blob/main/script.py) - Description
- [File Download](https://www.dropbox.com/s/example/file.zip) - Description
```

---

## Text Formatting

### Bold
```markdown
**Bold Text**
```

### Italic
```markdown
*Italic Text*
```

### Inline Code
```markdown
`code` or `command --flag`
```

### Strikethrough
```markdown
~~Strikethrough Text~~
```

---

## Lists

### Unordered List
```markdown
- Item 1
- Item 2
- Item 3
```

### Ordered List
```markdown
1. First item
2. Second item
3. Third item
```

### Nested List
```markdown
- Main item
  - Sub item 1
  - Sub item 2
- Another main item
```

---

## Headers

```markdown
# H1 - Main Title
## H2 - Section
### H3 - Subsection
#### H4 - Sub-subsection
```

---

## Blockquotes

```markdown
> This is a blockquote
> Can span multiple lines
```

### Blockquote with Note
```markdown
> **Note:** Important information here
```

---

## Horizontal Rule

```markdown
---
```

---

## Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

---

## Common Combinations

### Image + Code Block
```markdown
![Screenshot](path/to/image.png)
*Caption: Description*

```bash
command --flag value
```
```

### Code Block + Explanation
```markdown
I used the following command to extract the data:

```bash
cat file.txt | grep "pattern"
```

This command searches for the pattern in the file.
```

### Link + Image
```markdown
[Tool Website](https://example.com)

![Tool Screenshot](path/to/image.png)
*Caption: The tool interface*
```

---

## Flag Format

```markdown
## Flag

```
THM{flag_goes_here}
```
```

### Multiple Flags
```markdown
## Flags

### Task 1
```
THM{flag1}
THM{flag2}
```

### Task 2
```
THM{flag3}
```
```

---

## Complete Section Example

```markdown
## Task 1: Web Exploitation

I started by examining the login page.

![Login Page](./images/login.png)
*Caption: The initial login page*

I tested for SQL injection using this payload:

```bash
curl -X POST http://10.10.10.10/login \
  -d "username=admin' OR '1'='1&password=test"
```

The response confirmed the vulnerability. I then used this SQL query:

```sql
' UNION SELECT flag FROM flags WHERE id=1--
```

![Results](./images/results.png)
*Caption: The extracted flag*

The flag was: `THM{sql_injection_success}`
```

---

## Tips

1. **Images**: Always use relative paths like `./image.png` or `../images/screenshot.png` when possible
2. **Captions**: Use italic text on a new line after images for captions
3. **Code Blocks**: Specify the language for syntax highlighting
4. **Links**: Add descriptions after links in lists for clarity
5. **Spacing**: Leave blank lines between sections for better readability

