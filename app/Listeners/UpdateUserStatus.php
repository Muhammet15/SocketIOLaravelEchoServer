<?php

namespace App\Listeners;

use App\Events\UserStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Redis;

class UpdateUserStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserStatusUpdated $event)
    {
        $userId = $event->userId;
        $isOnline = $event->isOnline;

        if ($isOnline) {
            Redis::sadd('online_users', $userId);
        } else {
            Redis::srem('online_users', $userId);
        }
    }
}
