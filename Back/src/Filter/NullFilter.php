<?php

namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;


class NullFilter extends AbstractFilter
{
    const NULL_PARAMETER = 'null';
    const NULL_VALUES = ['1', 1, 'true', 'on'];
    const NOT_NULL_VALUES = ['0', 0, 'false', 'off'];

    /**
     * Passes a property through the filter.
     *
     * @param string $property
     * @param mixed $value
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     * @throws \Exception
     */
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        if (
            !isset($value[self::NULL_PARAMETER]) ||
            !$this->isPropertyEnabled($property) ||
            !$this->isPropertyMapped($property, $resourceClass)
        ) {
            return;
        }

        $isNull = in_array($value[self::NULL_PARAMETER], self::NULL_VALUES, true);
        $notNull = in_array($value[self::NULL_PARAMETER], self::NOT_NULL_VALUES, true);

        if (!$isNull && !$notNull) {
            throw new \Exception(
                sprintf(
                    'Null filter value "%s" not supported. Supported values are %s',
                    $value[self::NULL_PARAMETER],
                    implode(', ', array_merge(self::NULL_VALUES, self::NOT_NULL_VALUES))
                )
            );
        }

        $alias = 'o';
        $field = $property;

        if ($this->isPropertyNested($property)) {
            list($alias, $field) = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator);
        }

        $queryBuilder->andWhere(
            sprintf('%s.%s IS %s', $alias, $field, $isNull ? 'NULL' : 'NOT NULL')
        );
    }

    /**
     * Gets the description of this filter for the given resource.
     *
     * Returns an array with the filter parameter names as keys and array with the following data as values:
     *   - property: the property where the filter is applied
     *   - type: the type of the filter
     *   - required: if this filter is required
     *   - strategy: the used strategy
     *   - swagger (optional): additional parameters for the path operation, e.g. 'swagger' => ['description' => 'My Description']
     * The description can contain additional data specific to a filter.
     *
     * @param string $resourceClass
     *
     * @return array
     */
    public function getDescription(string $resourceClass): array
    {
        $properties = $this->properties;

        if (null === $properties) {
            $properties = array_fill_keys($this->getClassMetadata($resourceClass)->getFieldNames(), null);
        }

        return array_reduce(
            array_keys($properties),
            function($carry, $property) use ($resourceClass) {
                if (!$this->isPropertyMapped($property, $resourceClass)) {
                    return;
                }

                $carry[sprintf('%s[%s]', $property, self::NULL_PARAMETER)] = [
                    'property' => $property,
                    'type' => 'string',
                    'required' => false,
                ];

                return $carry;
            },
            []
        );
    }
}