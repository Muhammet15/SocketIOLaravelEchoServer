<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\UserStatusUpdated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

use Illuminate\Validation\ValidationException;
class SocketController extends Controller
{
    public function updateUserStatus(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        try {
            $user->is_online = !$user->is_online;
            $user->save();
            event(new UserStatusUpdated($user->id, $user->is_online));
            return response()->json(['message' => 'User status updated successfully', 'is_online' => $user->is_online]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user status'], 500);
        }
    }

    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {

        $this->validateLogin($request);

        if (Auth::attempt($this->credentials($request))) {

            return $this->sendLoginResponse($request);

        }

        throw ValidationException::withMessages([
            'email' => [trans('auth.failed')],
        ]);
    }

    /**
     * Validate the user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function validateLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        return $request->only('email', 'password');
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendLoginResponse(Request $request)
    {
        $user = Auth::user();
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }
    protected function authenticated(Request $request, $user)
        {
            $user->status->update(['is_online' => true]);

            return response()->json(['message' => 'Login successful']);
        }

        protected function loggedOut(Request $request)
        {
            if (Auth::check()) {
                Auth::user()->status->update(['is_online' => false]);
            }
        }
}
