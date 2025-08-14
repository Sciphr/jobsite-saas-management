/**
 * Utility functions for handling BigInt serialization in API responses
 */

/**
 * Convert BigInt values to strings recursively in an object or array
 */
export function serializeBigInt(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeBigInt(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const serialized = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized;
  }
  
  if (typeof obj === 'object') {
    // Handle Date objects and other object types
    if (obj instanceof Date) {
      return obj;
    }
    
    // For other objects (like Prisma results), convert to plain object first
    const plainObj = JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return plainObj;
  }
  
  return obj;
}

/**
 * Safe JSON response that handles BigInt values
 */
export function createSafeResponse(data, options = {}) {
  const serializedData = serializeBigInt(data);
  return Response.json(serializedData, options);
}