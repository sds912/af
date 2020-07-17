<?php

namespace App\Form;

use App\Entity\Entreprise;
use App\Entity\Inventaire;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InventaireType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            //->add('debut')
            //->add('fin')
            ->add('instruction')
            ->add('lieuReunion')
            ->add('dateReunion')
            ->add('presentsReunionOut')
            ->add('pvReunion')
            ->add('decisionCC')
            ->add('presiComite',EntityType::class,['class'=> User::class])
            ->add('membresCom')
            ->add('zones')
            ->add('localites')
            ->add('sousZones')
            ->add('entreprise',EntityType::class,['class'=> Entreprise::class])
            ->add('presentsReunion')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Inventaire::class,
            'csrf_protection'=>false,
            "allow_extra_fields" => true
        ]);
    }
}
