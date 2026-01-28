# Feature Implementation: Natural Language User Profile Parsing

## Overview
Successfully implemented a feature to parse natural language descriptions into structured user profiles for the EduVibe 3D application. This allows third-party integrations or deep links to pre-fill user preferences.

## Changes

### Backend
1.  **New Route**: Created `backend/src/routes/profile.ts`.
    *   **Endpoint**: `POST /api/parse-profile`
    *   **Logic**: Accepts a `text` string, uses Gemini LLM to extract `UserProfile` fields (age, language, difficulty, etc.), and returns a JSON object.
    *   **Robustness**: Handles missing fields with defaults and JSON parsing errors.
2.  **Registration**: Updated `backend/src/index.ts` to register the new router.

### Frontend
1.  **Integration**: Modified `frontend/src/components/InputPanel.tsx`.
2.  **Mechanisms**:
    *   **URL Parameter**: Checks `?profileText=...` on component mount.
    *   **Window Message**: Listens for `postMessage` with `{ type: 'UPDATE_PROFILE', text: '...' }` for iframe support.
3.  **UI Feedback**: Automatically expands the "Personalized Settings" panel upon successful parsing so the user can see and verify the changes.

## Verification & Usage

### Method 1: URL Parameter
Open the application with a query parameter:
```
http://localhost:5173/?profileText=I am a 22 year old Python student preparing for interviews
```
*Expected Result*: The profile panel opens, showing Age: 22, Language: Python, Difficulty: Intermediate (inferred), Goal: preparing for interviews.

### Method 2: Console / Iframe Integration
Run this in the browser console (or from a parent window):
```javascript
window.postMessage({
  type: 'UPDATE_PROFILE',
  text: 'Total beginner in C++, 15 years old, just for fun'
}, '*')
```
*Expected Result*: The profile panel updates to Age: 15, Language: C++, Difficulty: Beginner.

## API Specification

**POST /api/parse-profile**

*   **Request Body**:
    ```json
    { "text": "User description string" }
    ```
*   **Response**:
    ```json
    {
      "age": 20,
      "gender": "other",
      "programmingLanguage": "Python",
      "studyCycle": "2h/day",
      "difficulty": "beginner",
      "learningGoal": "..."
    }
    ```
