<?php
namespace App\Service;

use App\Entity\User;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Signer\Key;

class MercureCookieGenerator{
    private $secret;
    public function __construct(string $secret)
    {
        $this->secret=$secret;//la clé secret pour hasher le token
    }
    public function generate(User $user){
        $token=(new Builder())
                ->withClaim('mercure', ['subscribe' => ["http://asma-gestion-immo.com/user/{$user->getId()}"]])
                ->getToken(new Sha384(), new Key($this->secret));
        return "Bearer {$token}";
    }
}