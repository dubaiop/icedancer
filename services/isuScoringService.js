// ISU-compliant scoring system for ice dance elements
class ISUScoringService {
  constructor() {
    // ISU Technical Panel scoring parameters
    this.technicalElements = {
      twizzles: {
        baseValues: {
          'Level B': 2.0,
          'Level 1': 3.0,
          'Level 2': 3.5,
          'Level 3': 4.0,
          'Level 4': 4.5
        },
        requirements: {
          'Level 1': ['Minimum 6 rotations total', 'Clear twizzle action'],
          'Level 2': ['8 rotations total', 'Maintained unison'],
          'Level 3': ['10 rotations total', 'Complex entry/exit'],
          'Level 4': ['12 rotations total', 'Difficult variations', 'Perfect unison']
        }
      },
      lifts: {
        baseValues: {
          'Level B': 3.0,
          'Level 1': 4.0,
          'Level 2': 4.5,
          'Level 3': 5.0,
          'Level 4': 5.5
        },
        requirements: {
          'Level 1': ['3+ seconds airborne', 'Clear lift technique'],
          'Level 2': ['4+ seconds airborne', 'Rotation during lift'],
          'Level 3': ['5+ seconds airborne', 'Complex positions'],
          'Level 4': ['6+ seconds airborne', 'Difficult variations', 'Seamless transitions']
        }
      },
      stepSequences: {
        baseValues: {
          'Level B': 2.5,
          'Level 1': 3.0,
          'Level 2': 3.5,
          'Level 3': 4.0,
          'Level 4': 4.5
        },
        requirements: {
          'Level 1': ['Basic steps', 'Ice coverage'],
          'Level 2': ['Turn varieties', 'Edge quality'],
          'Level 3': ['Complex patterns', 'Difficult steps'],
          'Level 4': ['Intricate choreography', 'Exceptional difficulty', 'Perfect execution']
        }
      },
      spins: {
        baseValues: {
          'Level B': 2.0,
          'Level 1': 2.5,
          'Level 2': 3.0,
          'Level 3': 3.5,
          'Level 4': 4.0
        },
        requirements: {
          'Level 1': ['6+ rotations', 'Basic position'],
          'Level 2': ['8+ rotations', 'Position changes'],
          'Level 3': ['10+ rotations', 'Difficult positions'],
          'Level 4': ['12+ rotations', 'Complex variations', 'Exceptional control']
        }
      }
    };

    // Program Components scoring criteria
    this.programComponents = {
      skatingSkills: {
        criteria: [
          'Edge control and flow',
          'Balance and glide',
          'Speed and acceleration',
          'Ice coverage',
          'Effortless power'
        ],
        weight: 1.0
      },
      transitions: {
        criteria: [
          'Variety and creativity',
          'Smoothness between elements',
          'Intricate footwork',
          'Seamless connections',
          'Flow and continuity'
        ],
        weight: 1.0
      },
      performance: {
        criteria: [
          'Physical and emotional expression',
          'Musicality and timing',
          'Projection and energy',
          'Commitment and conviction',
          'Audience engagement'
        ],
        weight: 1.0
      },
      composition: {
        criteria: [
          'Program structure',
          'Ice pattern utilization',
          'Element placement',
          'Choreographic unity',
          'Creative originality'
        ],
        weight: 1.0
      }
    };

    // Grade of Execution (GOE) scale: -5 to +5
    this.goeScale = {
      '-5': { description: 'Very poor', multiplier: -0.50 },
      '-4': { description: 'Poor', multiplier: -0.40 },
      '-3': { description: 'Weak', multiplier: -0.30 },
      '-2': { description: 'Below average', multiplier: -0.20 },
      '-1': { description: 'Slightly below average', multiplier: -0.10 },
      '0': { description: 'Average', multiplier: 0.00 },
      '+1': { description: 'Slightly above average', multiplier: 0.10 },
      '+2': { description: 'Above average', multiplier: 0.20 },
      '+3': { description: 'Good', multiplier: 0.30 },
      '+4': { description: 'Very good', multiplier: 0.40 },
      '+5': { description: 'Exceptional', multiplier: 0.50 }
    };
  }

  // Determine level of difficulty for an element
  determineLevelOfDifficulty(elementType, analysisData) {
    if (!this.technicalElements[elementType]) {
      return 'Level B';
    }

    const element = this.technicalElements[elementType];
    let level = 'Level B';

    switch (elementType) {
      case 'twizzles':
        level = this.determineTwizzleLevel(analysisData);
        break;
      case 'lifts':
        level = this.determineLiftLevel(analysisData);
        break;
      case 'stepSequences':
        level = this.determineStepSequenceLevel(analysisData);
        break;
      case 'spins':
        level = this.determineSpinLevel(analysisData);
        break;
    }

    return level;
  }

  // Determine twizzle level based on analysis
  determineTwizzleLevel(analysisData) {
    const { rotationCount = 0, unison = 0, complexity = 0, consistency = 0 } = analysisData;

    if (rotationCount >= 12 && unison > 85 && complexity > 80 && consistency > 85) {
      return 'Level 4';
    } else if (rotationCount >= 10 && unison > 75 && complexity > 65) {
      return 'Level 3';
    } else if (rotationCount >= 8 && unison > 65) {
      return 'Level 2';
    } else if (rotationCount >= 6 && unison > 50) {
      return 'Level 1';
    }
    return 'Level B';
  }

  // Determine lift level based on analysis
  determineLiftLevel(analysisData) {
    const { airTime = 0, complexity = 0, positions = 0, transitions = 0 } = analysisData;

    if (airTime >= 6000 && complexity > 85 && positions >= 3 && transitions > 80) {
      return 'Level 4';
    } else if (airTime >= 5000 && complexity > 70 && positions >= 2) {
      return 'Level 3';
    } else if (airTime >= 4000 && complexity > 55) {
      return 'Level 2';
    } else if (airTime >= 3000) {
      return 'Level 1';
    }
    return 'Level B';
  }

  // Determine step sequence level
  determineStepSequenceLevel(analysisData) {
    const { variety = 0, difficulty = 0, execution = 0, coverage = 0 } = analysisData;

    if (variety > 85 && difficulty > 85 && execution > 85 && coverage > 80) {
      return 'Level 4';
    } else if (variety > 75 && difficulty > 70 && execution > 75) {
      return 'Level 3';
    } else if (variety > 65 && difficulty > 55 && execution > 65) {
      return 'Level 2';
    } else if (variety > 50 && execution > 50) {
      return 'Level 1';
    }
    return 'Level B';
  }

  // Determine spin level
  determineSpinLevel(analysisData) {
    const { rotationCount = 0, positions = 0, control = 0, variations = 0 } = analysisData;

    if (rotationCount >= 12 && positions >= 3 && control > 85 && variations > 80) {
      return 'Level 4';
    } else if (rotationCount >= 10 && positions >= 2 && control > 75) {
      return 'Level 3';
    } else if (rotationCount >= 8 && control > 65) {
      return 'Level 2';
    } else if (rotationCount >= 6) {
      return 'Level 1';
    }
    return 'Level B';
  }

  // Calculate Grade of Execution (GOE)
  calculateGOE(elementType, level, analysisData) {
    const baseFactors = this.getGOEFactors(elementType);
    let goeScore = 0;

    // Analyze each GOE factor
    for (const factor of baseFactors) {
      const factorScore = this.evaluateGOEFactor(factor, analysisData);
      goeScore += factorScore;
    }

    // Average and clamp to -5 to +5 range
    goeScore = goeScore / baseFactors.length;
    goeScore = Math.max(-5, Math.min(5, Math.round(goeScore * 2) / 2)); // Round to nearest 0.5

    return {
      goe: goeScore,
      description: this.goeScale[goeScore.toString()]?.description || 'Average',
      multiplier: this.goeScale[goeScore.toString()]?.multiplier || 0,
      factors: this.analyzeGOEFactors(elementType, analysisData)
    };
  }

  // Get GOE evaluation factors for each element type
  getGOEFactors(elementType) {
    const commonFactors = [
      'execution_quality',
      'flow_continuity',
      'ice_coverage',
      'speed_acceleration'
    ];

    const specificFactors = {
      twizzles: ['rotation_quality', 'unison', 'traveling_distance', 'entry_exit'],
      lifts: ['height_duration', 'position_difficulty', 'partner_assistance', 'landing_quality'],
      stepSequences: ['step_variety', 'edge_quality', 'pattern_complexity', 'musical_interpretation'],
      spins: ['centering', 'rotation_speed', 'position_difficulty', 'balance_control']
    };

    return [...commonFactors, ...(specificFactors[elementType] || [])];
  }

  // Evaluate individual GOE factor
  evaluateGOEFactor(factor, analysisData) {
    // Convert analysis data to GOE factor scores
    switch (factor) {
      case 'execution_quality':
        return this.scoreToGOE(analysisData.overall || 70);
      case 'flow_continuity':
        return this.scoreToGOE(analysisData.flow || 70);
      case 'ice_coverage':
        return this.scoreToGOE(analysisData.coverage || 70);
      case 'speed_acceleration':
        return this.scoreToGOE(analysisData.speed || 70);
      case 'rotation_quality':
        return this.scoreToGOE(analysisData.rotationQuality || 70);
      case 'unison':
        return this.scoreToGOE(analysisData.unison || 70);
      case 'height_duration':
        return this.scoreToGOE(analysisData.heightDuration || 70);
      case 'step_variety':
        return this.scoreToGOE(analysisData.stepVariety || 70);
      case 'centering':
        return this.scoreToGOE(analysisData.centering || 70);
      default:
        return 0;
    }
  }

  // Convert 0-100 score to GOE scale (-5 to +5)
  scoreToGOE(score) {
    if (score >= 95) return 5;
    if (score >= 90) return 4;
    if (score >= 85) return 3;
    if (score >= 80) return 2;
    if (score >= 75) return 1;
    if (score >= 65) return 0;
    if (score >= 55) return -1;
    if (score >= 45) return -2;
    if (score >= 35) return -3;
    if (score >= 25) return -4;
    return -5;
  }

  // Calculate technical element score
  calculateTechnicalScore(element, level, goe) {
    const baseValue = this.technicalElements[element.type]?.baseValues[level] || 1.0;
    const goeValue = baseValue * goe.multiplier;
    return {
      baseValue: baseValue,
      goeValue: goeValue,
      totalScore: baseValue + goeValue,
      level: level,
      goe: goe
    };
  }

  // Score program components (0-10 scale)
  scoreProgramComponent(componentType, analysisData) {
    const component = this.programComponents[componentType];
    if (!component) return { score: 5.0, breakdown: {} };

    let totalScore = 0;
    const breakdown = {};

    for (const criterion of component.criteria) {
      const criterionScore = this.scoreCriterion(criterion, analysisData);
      breakdown[criterion] = criterionScore;
      totalScore += criterionScore;
    }

    const averageScore = totalScore / component.criteria.length;
    
    return {
      score: Math.round(averageScore * 4) / 4, // Round to nearest 0.25
      breakdown: breakdown,
      weight: component.weight
    };
  }

  // Score individual criterion within a program component
  scoreCriterion(criterion, analysisData) {
    // Map analysis data to criterion scores (0-10 scale)
    const scoreMapping = {
      'Edge control and flow': analysisData.edgeQuality || 7.0,
      'Balance and glide': analysisData.balance || 7.0,
      'Speed and acceleration': analysisData.speed || 7.0,
      'Ice coverage': analysisData.coverage || 7.0,
      'Effortless power': analysisData.power || 7.0,
      'Variety and creativity': analysisData.variety || 7.0,
      'Smoothness between elements': analysisData.transitions || 7.0,
      'Intricate footwork': analysisData.footwork || 7.0,
      'Seamless connections': analysisData.connections || 7.0,
      'Flow and continuity': analysisData.flow || 7.0,
      'Physical and emotional expression': analysisData.expression || 7.0,
      'Musicality and timing': analysisData.musicality || 7.0,
      'Projection and energy': analysisData.projection || 7.0,
      'Commitment and conviction': analysisData.commitment || 7.0,
      'Audience engagement': analysisData.engagement || 7.0,
      'Program structure': analysisData.structure || 7.0,
      'Ice pattern utilization': analysisData.patterns || 7.0,
      'Element placement': analysisData.placement || 7.0,
      'Choreographic unity': analysisData.unity || 7.0,
      'Creative originality': analysisData.originality || 7.0
    };

    const rawScore = scoreMapping[criterion] || 7.0;
    // Convert from 0-100 scale to 0-10 scale if needed
    const normalizedScore = rawScore > 10 ? rawScore / 10 : rawScore;
    
    return Math.max(0, Math.min(10, normalizedScore));
  }

  // Calculate complete program score
  calculateProgramScore(elements, componentAnalysis) {
    let technicalScore = 0;
    let componentScore = 0;
    
    const elementScores = [];
    
    // Calculate technical element scores
    for (const element of elements) {
      const level = this.determineLevelOfDifficulty(element.type, element.analysis || {});
      const goe = this.calculateGOE(element.type, level, element.analysis || {});
      const score = this.calculateTechnicalScore(element, level, goe);
      
      elementScores.push({
        element: element.type,
        level: level,
        baseValue: score.baseValue,
        goe: goe.goe,
        goeValue: score.goeValue,
        totalScore: score.totalScore
      });
      
      technicalScore += score.totalScore;
    }

    // Calculate program component scores
    const componentScores = {};
    for (const componentType of Object.keys(this.programComponents)) {
      const componentResult = this.scoreProgramComponent(componentType, componentAnalysis || {});
      componentScores[componentType] = componentResult;
      componentScore += componentResult.score * componentResult.weight;
    }

    // Apply factored scoring (multiply by factor based on program type)
    const technicalFactor = 1.0; // For senior ice dance
    const componentFactor = 1.25; // Standard component factor

    const finalTechnicalScore = technicalScore * technicalFactor;
    const finalComponentScore = componentScore * componentFactor;
    const totalScore = finalTechnicalScore + finalComponentScore;

    return {
      technical: {
        elements: elementScores,
        total: Math.round(finalTechnicalScore * 100) / 100,
        factor: technicalFactor
      },
      components: {
        scores: componentScores,
        total: Math.round(finalComponentScore * 100) / 100,
        factor: componentFactor
      },
      totalScore: Math.round(totalScore * 100) / 100,
      deductions: 0 // Would include falls, time violations, etc.
    };
  }

  // Analyze GOE factors for detailed feedback
  analyzeGOEFactors(elementType, analysisData) {
    const factors = this.getGOEFactors(elementType);
    const analysis = {};

    for (const factor of factors) {
      const score = this.evaluateGOEFactor(factor, analysisData);
      analysis[factor] = {
        score: score,
        description: this.getFactorDescription(factor, score),
        recommendation: this.getFactorRecommendation(factor, score)
      };
    }

    return analysis;
  }

  // Get description for GOE factor score
  getFactorDescription(factor, score) {
    if (score >= 3) return 'Excellent';
    if (score >= 1) return 'Good';
    if (score === 0) return 'Average';
    if (score >= -2) return 'Needs improvement';
    return 'Significant issues';
  }

  // Get recommendation for improving GOE factor
  getFactorRecommendation(factor, score) {
    if (score >= 3) return 'Maintain this high standard';
    
    const recommendations = {
      'execution_quality': 'Focus on technical precision and clean execution',
      'flow_continuity': 'Work on seamless transitions between elements',
      'ice_coverage': 'Utilize more of the ice surface in your program',
      'speed_acceleration': 'Increase skating speed and power',
      'rotation_quality': 'Improve rotation technique and control',
      'unison': 'Synchronize movements better with your partner',
      'height_duration': 'Work on achieving greater height and longer duration',
      'step_variety': 'Include more diverse and complex step patterns',
      'centering': 'Focus on maintaining center position during spins'
    };

    return recommendations[factor] || 'Continue working on this aspect';
  }

  // Generate detailed performance report
  generatePerformanceReport(elements, componentAnalysis) {
    const programScore = this.calculateProgramScore(elements, componentAnalysis);
    
    return {
      summary: {
        totalScore: programScore.totalScore,
        technicalScore: programScore.technical.total,
        componentScore: programScore.components.total,
        rank: this.estimateRank(programScore.totalScore)
      },
      technical: programScore.technical,
      components: programScore.components,
      recommendations: this.generateRecommendations(programScore),
      strengths: this.identifyStrengths(programScore),
      areasForImprovement: this.identifyWeaknesses(programScore)
    };
  }

  // Estimate competitive ranking based on score
  estimateRank(totalScore) {
    if (totalScore >= 85) return 'International Elite Level';
    if (totalScore >= 75) return 'National Championship Level';
    if (totalScore >= 65) return 'Regional Championship Level';
    if (totalScore >= 55) return 'Sectional Level';
    if (totalScore >= 45) return 'Club Level';
    return 'Developing Level';
  }

  // Generate training recommendations
  generateRecommendations(programScore) {
    const recommendations = [];
    
    // Technical recommendations
    for (const element of programScore.technical.elements) {
      if (element.goe < 0) {
        recommendations.push({
          type: 'technical',
          priority: 'high',
          element: element.element,
          suggestion: `Improve ${element.element} execution - current GOE: ${element.goe}`
        });
      }
    }

    // Component recommendations
    for (const [component, data] of Object.entries(programScore.components.scores)) {
      if (data.score < 7.0) {
        recommendations.push({
          type: 'component',
          priority: 'medium',
          component: component,
          suggestion: `Focus on ${component} - current score: ${data.score}/10`
        });
      }
    }

    return recommendations;
  }

  // Identify performance strengths
  identifyStrengths(programScore) {
    const strengths = [];

    // Technical strengths
    for (const element of programScore.technical.elements) {
      if (element.goe >= 2) {
        strengths.push(`Excellent ${element.element} execution (GOE: +${element.goe})`);
      }
    }

    // Component strengths
    for (const [component, data] of Object.entries(programScore.components.scores)) {
      if (data.score >= 8.0) {
        strengths.push(`Strong ${component} (${data.score}/10)`);
      }
    }

    return strengths;
  }

  // Identify areas needing improvement
  identifyWeaknesses(programScore) {
    const weaknesses = [];

    // Technical weaknesses
    for (const element of programScore.technical.elements) {
      if (element.goe <= -1) {
        weaknesses.push(`${element.element} needs improvement (GOE: ${element.goe})`);
      }
    }

    // Component weaknesses
    for (const [component, data] of Object.entries(programScore.components.scores)) {
      if (data.score < 6.5) {
        weaknesses.push(`${component} below average (${data.score}/10)`);
      }
    }

    return weaknesses;
  }
}

export default new ISUScoringService();