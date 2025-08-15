# Account Deletion Flow Documentation

## Overview

This document describes the comprehensive account deletion flow implemented for the TeIpsum application. The solution addresses the complexities of deleting user accounts across multiple microservices while preserving business data and maintaining data integrity.

## Architecture

### Services Involved

1. **User Service** - Manages user profiles and coordinates deletion
2. **Auth Service** - Handles authentication credentials
3. **Order Service** - Manages orders and handles anonymization
4. **Frontend** - Provides user interface with warnings and confirmations

### Event-Driven Architecture

The deletion process uses Kafka events to coordinate actions across services:

- `user-deletion-requested` - Initiates the deletion process
- `user-orders-anonymized` - Signals that orders have been anonymized
- `user-deletion-completed` - Triggers final auth cleanup

## Flow Description

### 1. User Initiates Deletion

**Frontend:** User clicks "Delete Account" in profile settings
- Shows comprehensive warning dialog with 3 steps
- Displays order count and consequences
- Requires typing "DELETE MY ACCOUNT" to confirm

**API Call:** `POST /api/users/initiate-deletion`

### 2. Deletion Information Gathering

**User Service:** 
- Calls Order Service to get user's order information
- Prepares comprehensive deletion info including:
  - Order count
  - Active order status
  - Account details
  - Warning messages

**API:** `GET /api/users/deletion-info`

### 3. Order Handling Strategy

**Problem Solved:** Instead of deleting orders (losing business data), we anonymize them.

**Order Service:**
- Receives `user-deletion-requested` event
- Sets `userId` to `null` on all user orders
- Preserves order data for business analytics
- Publishes `user-orders-anonymized` event

### 4. Profile Deletion

**User Service:**
- Receives `user-orders-anonymized` event
- Deletes user profile from database
- Publishes `user-deletion-completed` event

### 5. Auth Cleanup

**Auth Service:**
- Receives `user-deletion-completed` event
- Deletes user credentials and roles
- Completes the deletion process

### 6. Frontend Completion

- Shows success message
- Clears all local storage
- Redirects to home page

## Key Features

### ✅ Comprehensive User Warnings

- **Order Impact Disclosure**: Shows exact number of orders that will be affected
- **Active Order Warnings**: Highlights pending/processing orders
- **Step-by-Step Confirmation**: 3-step process prevents accidental deletion
- **Alternative Suggestions**: Suggests account deactivation instead

### ✅ Data Preservation Strategy

- **Order Anonymization**: Orders remain for business analytics but lose user connection
- **Business Intelligence**: Preserves sales data, product performance metrics
- **Regulatory Compliance**: Removes personal data while keeping transaction records

### ✅ Security & Reliability

- **CSRF Protection**: Secure API endpoints
- **Authentication Verification**: Multiple auth checks
- **Transaction Safety**: Database transactions ensure consistency
- **Error Handling**: Comprehensive error recovery

### ✅ User Experience

- **Progressive Disclosure**: Information revealed step-by-step
- **Clear Consequences**: Explicit about what will be lost
- **Visual Warnings**: Color-coded alerts and icons
- **Mobile Responsive**: Works on all device sizes

## API Endpoints

### User Service

```http
GET /api/users/deletion-info
```
Returns comprehensive deletion information including order details.

```http
POST /api/users/initiate-deletion
```
Starts the account deletion process.

### Order Service

```http
GET /api/orders/user/{userId}/info
```
Internal endpoint for getting user order statistics.

## Event Schemas

### UserDeletionRequestedEvent
```json
{
  "userId": "string",
  "email": "string", 
  "requestedAt": "timestamp",
  "hasOrders": "boolean",
  "orderCount": "integer"
}
```

### UserOrdersAnonymizedEvent
```json
{
  "userId": "string",
  "email": "string",
  "anonymizedOrderCount": "integer", 
  "anonymizedAt": "timestamp"
}
```

### UserDeletionCompletedEvent
```json
{
  "userId": "string",
  "email": "string",
  "deletedAt": "timestamp",
  "deletedBy": "string"
}
```

## Frontend Components

### AccountDeletionDialog
- Multi-step confirmation dialog
- Loads deletion info dynamically
- Requires typed confirmation
- Handles errors gracefully

### AccountDeletionService
- API communication layer
- Error handling and user messages
- CSRF token management
- Logout and cleanup

## Database Impact

### User Service
```sql
DELETE FROM user_profiles WHERE id = ?
```

### Auth Service  
```sql
DELETE FROM user_credentials WHERE id = ?
-- Cascades to user_roles table
```

### Order Service
```sql
UPDATE orders SET user_id = NULL WHERE user_id = ?
-- Orders preserved but anonymized
```

## Benefits of This Approach

### 🎯 **User-Centric**
- Clear communication about consequences
- Multiple confirmation steps prevent accidents
- Transparent about data handling

### 📊 **Business-Friendly**
- Preserves valuable business data
- Maintains sales analytics
- Keeps transaction history for reporting

### 🔒 **Compliant**
- Removes personal identifiable information
- Maintains audit trails
- Follows data protection principles

### 🛠 **Developer-Friendly**
- Event-driven architecture
- Clear separation of concerns
- Comprehensive error handling
- Well-documented APIs

## Usage Example

```jsx
import AccountDeletionDialog from './components/AccountDeletion/AccountDeletionDialog';
import accountDeletionService from './services/accountDeletionService';

function ProfilePage() {
  const [showDeletion, setShowDeletion] = useState(false);
  
  const handleDeleteAccount = async () => {
    try {
      await accountDeletionService.initiateAccountDeletion();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={() => setShowDeletion(true)}>
        Delete Account
      </button>
      
      <AccountDeletionDialog
        isOpen={showDeletion}
        onClose={() => setShowDeletion(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
```

## Testing

The implementation includes comprehensive tests for:

- ✅ User Service deletion coordination
- ✅ Order Service anonymization logic  
- ✅ Auth Service credential cleanup
- ✅ Event handling and error scenarios
- ✅ Frontend component interactions

## Monitoring & Logging

All services log key events:
- Deletion requests initiated
- Orders anonymized
- Credentials removed
- Errors and failures

## Future Enhancements

1. **Admin Override**: Allow admins to delete accounts with different rules
2. **Delayed Deletion**: Grace period before actual deletion
3. **Data Export**: Allow users to download their data before deletion
4. **Retention Policies**: Automatic cleanup of old anonymized orders

## Conclusion

This account deletion flow provides a robust, user-friendly, and business-conscious approach to handling account deletions in a microservices architecture. It balances user privacy rights with business needs while maintaining system integrity and providing excellent user experience.

The solution demonstrates best practices in:
- Microservice coordination
- User experience design
- Data privacy compliance
- Error handling and recovery
- Security implementation
