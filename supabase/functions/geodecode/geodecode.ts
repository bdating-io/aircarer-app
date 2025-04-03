// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")



// 地址验证类型定义
interface ValidationResult {
  valid: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  formatted_address?: string;
  error?: {
    code: string;
    message: string;
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 1. 配置检查
    const GOOGLE_MAP_API_KEY = Deno.env.get('GOOGLE_MAP_API_KEY');
    if (!GOOGLE_MAP_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    // 2. 获取请求数据
    const { address } = await req.json();
    if (!address || typeof address !== 'string') {
      return Response.json(
        { valid: false, error: { code: 'INVALID_INPUT', message: 'Address is required' } },
        { status: 400 }
      );
    }

    // 3. 调用Google Geocoding API
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAP_API_KEY}`;
    const response = await fetch(apiUrl);
    const googleResponse = await response.json();

    // 4. 验证逻辑
    const validation: ValidationResult = { valid: false };

    if (googleResponse.status === 'OK' && googleResponse.results?.length > 0) {
      const firstResult = googleResponse.results[0];
      
      // 基础验证：检查返回的地址组件
      const hasStreetNumber = firstResult.address_components?.some(
        comp => comp.types.includes('street_number')
      );
      const hasRoute = firstResult.address_components?.some(
        comp => comp.types.includes('route')
      );
      
      // 检查位置类型
      const isPrecise = firstResult.geometry?.location_type === 'ROOFTOP' || 
                       firstResult.geometry?.location_type === 'RANGE_INTERPOLATED';

      if (hasStreetNumber && hasRoute && isPrecise) {
        validation.valid = true;
        validation.coordinates = {
          lat: firstResult.geometry.location.lat,
          lng: firstResult.geometry.location.lng
        };
        validation.formatted_address = firstResult.formatted_address;
      } else {
        validation.error = {
          code: 'IMPRECISE_ADDRESS',
          message: 'Address could not be precisely located'
        };
      }
    } else {
      validation.error = {
        code: googleResponse.status || 'UNKNOWN_ERROR',
        message: googleResponse.error_message || 'Address validation failed'
      };
    }

    // 返回验证结果
    return Response.json(validation, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Geocoding error:", error);
    return Response.json(
      { 
        valid: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error.message 
        } 
      },
      { status: 500 }
    );
  }
});

/* 测试示例：

curl -X POST 'http://localhost:54321/functions/v1/geodecode' \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"address":"32 Argyle Way, Wantirna South"}'

成功响应：
{
  "valid": true,
  "coordinates": {
    "lat": -37.8621,
    "lng": 145.211
  },
  "formatted_address": "32 Argyle Way, Wantirna South VIC 3152, Australia"
}

失败响应：
{
  "valid": false,
  "error": {
    "code": "IMPRECISE_ADDRESS",
    "message": "Address could not be precisely located"
  }
}
*/

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/geodecode' \
    --header 'Authorization: Bearer ${SUPABASE_ANON_KEY} or LoggedInUserJWTKey' \
    --header 'Content-Type: application/json' \
    --data '{"address":"123 Flinder Street, Melbourne, 3000"}'

*/