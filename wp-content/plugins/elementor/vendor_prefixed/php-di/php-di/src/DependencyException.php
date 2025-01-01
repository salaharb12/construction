<?php

declare (strict_types=1);
namespace ElementorDeps\DI;

use ElementorDeps\Psr\Container\ContainerExceptionInterface;
/**
 * Exception for the Container.
 */
class DependencyException extends \Exception implements ContainerExceptionInterface
{
}
