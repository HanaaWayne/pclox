import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
    <div className="banniere">
        <h3 className="title">
          "Simplifiez l’apprentissage, louez en toute liberté."
        </h3>
        <div className="banniere-content">
           
        </div>
    </div>

    <div className="container">
      <div className="container-content">
        <div className="content">
            <p className="content-title">Qui somme nous ?</p>
            <p className="content-text">Chez PCLOX, notre mission est de rendre la technologie accessible à tous les élèves et étudiants. 
                Nous proposons une solution pratique et abordable pour louer des ordinateurs adaptés aux besoins des études, qu’il 
                s’agisse de révisions, de projets scolaires ou d’un travail quotidien.<br /><br />
                PCLOX s’adresse aussi bien aux étudiants en quête d’un ordinateur 
                performant qu’aux établissements scolaires souhaitant offrir un service de location simple et efficace à leurs élèves.
                <br /><br />
                L'objectif est de démocratiser l’accès aux outils numériques afin de permettre à chaque étudiant de travailler dans les 
                meilleures conditions possibles et de réussir pleinement son parcours éducatif.
            </p>
        </div>

        <div className="content-2">
            <p className="content-title-2">Comment ça fonctionne !</p>
            <div className="content-block">
                <div className="content-text-1">Parcourez le catalogue et sélectionnez l’ordinateur qui correspond à vos besoins : 
                    bureautique, travail collaboratif ou logiciels spécifiques à vos études</div>

                <div className="content-text-2">Réservez en quelques clics. Indiquez la durée de location souhaitée et confirmez votre 
                    réservation gratuitement.</div>

                <div className="content-text-3">Rendez-vous à votre établissement pour récupérer votre 
                    ordinateur et commencer à l’utiliser immédiatement.</div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
