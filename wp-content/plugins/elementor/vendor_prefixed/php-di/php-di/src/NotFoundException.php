<?php

declare (strict_types=1);
namespace ElementorDeps\DI;

use ElementorDeps\Psr\Container\NotFoundExceptionInterface;
/**
 * Exception thrown when a class or a value is not found in the container.
 */
class NotFoundException extends \Exception implements NotFoundExceptionInterface
{
}
