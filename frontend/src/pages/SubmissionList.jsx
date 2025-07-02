<Route
  path="/submissions/:id"
  element={
    <ProtectedRoute>
      <SubmissionList />
    </ProtectedRoute>
  }
/>
