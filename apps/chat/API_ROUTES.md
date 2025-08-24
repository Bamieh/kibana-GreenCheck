# API Routes Documentation

## Graph Generation API

### Endpoint: `/api/graph`

This API route calls the `generateGraph` function from the `@greenCheck/greencheck-module` package to generate a graph and return it as a response.

#### Methods

- **GET** - Generate a graph and return the result
- **POST** - Generate a graph and return the result

#### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Graph generated successfully",
  "data": {
    "image": "base64EncodedImageString",
    "mimeType": "image/png",
    "size": 12345
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to generate graph",
  "details": "Specific error message"
}
```

#### Usage Example

```typescript
// Generate a graph
const response = await fetch('/api/graph', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const result = await response.json();

if (result.success) {
  // Display the image
  const img = document.createElement('img');
  img.src = `data:${result.data.mimeType};base64,${result.data.image}`;
  document.body.appendChild(img);
} else {
  console.error('Error:', result.error);
}
```

#### Frontend Component

The `GraphGenerator` component in `src/components/GraphGenerator.tsx` provides a user interface for testing this API route. It includes:

- A button to trigger graph generation
- Loading state indication
- Error handling and display
- Image display when successful
- Fallback to JSON display if image data is not available

#### Dependencies

This API route depends on:
- `@greenCheck/greencheck-module` package
- The `generateGraphImageData` function from the package
- Next.js API routes functionality

#### Notes

- The generated graph is returned as a base64-encoded PNG image
- The original `generateGraph` function was designed for tslab (Jupyter-like environments)
- A new `generateGraphImageData` function was created specifically for API usage
- The image data is converted to base64 for easy transmission over HTTP
