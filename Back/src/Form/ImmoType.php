<?php

namespace App\Form;

use App\Entity\Immobilisation;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ImmoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('libelle')
            ->add('code')
            ->add('compteImmo')
            ->add('compteAmort')
            ->add('emplacement')
            ->add('dateAcquisition')
            ->add('dateMiseServ')
            ->add('dateSortie')
            ->add('dureeUtilite')
            ->add('taux')
            ->add('valOrigine')
            ->add('dotation')
            ->add('cumulAmortiss')
            ->add('vnc')
            ->add('etat')
            ->add('description')
            ->add('numeroOrdre')
            ->add('endEtat')
            ->add('status')
            ->add('image')
            ->add('dateLecture')
            ->add('isMatched')
            ->add('approvStatus')
            ->add('endDescription')
            ->add('endLibelle')
            ->add('entreprise')
            ->add('inventaire')
            ->add('lecteur')
            ->add('localite')
            ->add('matchedImmo')
            ->add('ajusteur')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Immobilisation::class,
        ]);
    }
}
